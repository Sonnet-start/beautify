import { analyzeImage } from "@/lib/ai/gemini";
import { handleCORSOptions, setCORSHeaders } from "@/lib/cors";
import { createRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profile";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Rate limiting: 10 uploads per 1 minute per IP
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
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

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Изображение отсутствует" }, { status: 400 })
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Поддерживаются форматы JPEG, PNG и WebP" }, { status: 400 })
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return setCORSHeaders(
        request,
        NextResponse.json({ error: "Размер изображения не должен превышать 5 МБ" }, { status: 400 })
      );
    }

    // Convert to base64 for AI analysis
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Get user profile from profiles table
    const userProfile = await getUserProfile(user.id);

    // Analyze image with Gemini Vision
    const analysis = await analyzeImage(base64, file.type, userProfile);

    // Upload image to Supabase Storage
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("skin-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return setCORSHeaders(
        request,
        NextResponse.json(
          { error: `Ошибка загрузки изображения: ${uploadError.message}` },
          { status: 500 }
        )
      );
    }

    // Save analysis to database
    const { data: dbData, error: dbError } = await supabase
      .from("photo_analyses")
      // @ts-expect-error - Supabase types issue
      .insert({
        user_id: user.id,
        image_path: uploadData.path,
        analysis_text: analysis,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Try to delete uploaded image if DB insert fails
      await supabase.storage.from("skin-photos").remove([fileName]);
      return setCORSHeaders(
        request,
        NextResponse.json(
          { error: `Ошибка сохранения анализа: ${dbError.message}` },
          { status: 500 }
        )
      );
    }

    return setCORSHeaders(
      request,
      NextResponse.json({
        analysis,
        imagePath: uploadData.path,
        // @ts-expect-error - dbData typed as never due to Supabase types
        analysisId: dbData?.id,
      })
    );
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return setCORSHeaders(
      request,
      NextResponse.json({ error: "Ошибка при анализе изображения" }, { status: 500 })
    );
  }
}
