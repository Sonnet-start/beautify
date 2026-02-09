import { analyzeImage, generateRecommendation } from "@/lib/ai/gemini";
import { handleCORSOptions, setCORSHeaders } from "@/lib/cors";
import { createRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profile";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Rate limiting: 30 requests per 1 minute per IP
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 30,
});

export async function OPTIONS(request: NextRequest) {
  return handleCORSOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.success) {
      return setCORSHeaders(
        request,
        NextResponse.json(
          {
            error: "Слишком много запросов. Попробуйте позже.",
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimitResult.limit.toString(),
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
              "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            },
          }
        )
      );
    }

    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Требуется авторизация" }, { status: 401 })
      );
    }

    const body = await request.json();
    const { message, image, history, sessionId } = body;
    const MAX_MESSAGE_LENGTH = 2000;
    const MAX_HISTORY = 20;
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!message || typeof message !== "string") {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Сообщение обязательно" }, { status: 400 })
      );
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Сообщение слишком длинное" }, { status: 400 })
      );
    }

    // Get user profile from database
    const userProfile = await getUserProfile(user.id);

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .slice(-MAX_HISTORY)
      : [];

    let resultText = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let resultHistory: any[] = [];
    let currentSessionId = sessionId;

    if (image) {
      if (typeof image !== "string") {
        return setCORSHeaders(
          request,
          NextResponse.json({ error: "Неверный формат изображения" }, { status: 400 })
        );
      }

      // Extract mimeType from base64 data URL
      const dataUrlMatch = image.match(/^data:(.+);base64,(.*)$/);
      const mimeType = dataUrlMatch?.[1] ?? "image/jpeg";
      const base64Data = dataUrlMatch?.[2] ?? image;

      if (!allowedImageTypes.includes(mimeType)) {
        return setCORSHeaders(
          request,
          NextResponse.json(
            { error: "Неподдерживаемый формат. Используйте JPG, PNG или WEBP." },
            { status: 400 }
          )
        );
      }

      const approxBytes = Math.ceil((base64Data.length * 3) / 4);
      if (approxBytes > MAX_IMAGE_BYTES) {
        return setCORSHeaders(
          request,
          NextResponse.json(
            { error: "Размер изображения не должен превышать 5 МБ" },
            { status: 400 }
          )
        );
      }

      const analysisText = await analyzeImage(base64Data, mimeType, userProfile);
      resultText = analysisText;
      resultHistory = [
        ...safeHistory,
        { role: "user", content: message },
        { role: "assistant", content: analysisText },
      ];

      // Upload image to Supabase Storage
      const fileExt = mimeType.split("/")[1] || "jpeg";
      const filename = `${user.id}/${Date.now()}.${fileExt}`;
      const buffer = Buffer.from(base64Data, "base64");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("skin-photos")
        .upload(filename, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        // We continue, but log the error. The analysis is more important than the stored image for now.
      }

      // Save photo analysis to DB
      // @ts-expect-error - Supabase types issue
      await supabase.from("photo_analyses").insert({
        user_id: user.id,
        analysis_text: analysisText,
        image_path: uploadData?.path || null,
      });
    } else {
      // Regular text chat
      // 1. Ensure Session exists
      if (!currentSessionId) {
        const { data: session, error: sessionError } = await supabase
          .from("chat_sessions")
          // @ts-expect-error - Supabase types issue
          .insert({
            user_id: user.id,
            title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          })
          .select("id")
          .single();

        if (sessionError) throw sessionError;
        // @ts-expect-error - Supabase types issue
        currentSessionId = session?.id;
      }

      const genResult = await generateRecommendation(message, userProfile, safeHistory);
      resultText = genResult.text;
      resultHistory = genResult.history;

      // 2. Save messages to DB
      // @ts-expect-error - Supabase types issue
      await supabase.from("chat_messages").insert([
        { session_id: currentSessionId, role: "user", content: message },
        { session_id: currentSessionId, role: "assistant", content: resultText },
      ]);
    }

    return setCORSHeaders(
      request,
      NextResponse.json({
        response: resultText,
        history: resultHistory,
        sessionId: currentSessionId,
      })
    );
  } catch (error) {
    console.error("AI Chat Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";

    return setCORSHeaders(request, NextResponse.json({ error: errorMessage }, { status: 500 }));
  }
}
