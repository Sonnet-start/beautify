import { type UserProfile, analyzeImage, generateRecommendation } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "?????????? ???????????" }, { status: 401 });
    }

    const body = await request.json();
    const { message, image, history } = body;
    const MAX_MESSAGE_LENGTH = 2000;
    const MAX_HISTORY = 20;
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "????????? ???????????" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "????????? ??????? ???????" }, { status: 400 });
    }

    const goalsRaw = user.user_metadata?.goals;
    const problemsRaw = user.user_metadata?.skin_problems;

    // Get user profile from metadata
    const userProfile: UserProfile = {
      name: user.user_metadata?.name,
      age: user.user_metadata?.age,
      skinType: user.user_metadata?.skin_type,
      problems: Array.isArray(problemsRaw)
        ? problemsRaw
        : problemsRaw
          ? [problemsRaw]
          : [],
      allergies: user.user_metadata?.allergies,
      goals: Array.isArray(goalsRaw) ? goalsRaw : goalsRaw ? [goalsRaw] : [],
    };

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

    // Generate AI response
    let result: {
      text: string;
      history: { role: "user" | "assistant"; content: string }[];
    };

    if (image) {
      if (typeof image !== "string") {
        return NextResponse.json({ error: "???????????? ?????? ???????????" }, { status: 400 });
      }

      // Extract mimeType from base64 data URL
      const dataUrlMatch = image.match(/^data:(.+);base64,(.*)$/);
      const mimeType = dataUrlMatch?.[1] ?? "image/jpeg";
      const base64Data = dataUrlMatch?.[2] ?? image;

      if (!allowedImageTypes.includes(mimeType)) {
        return NextResponse.json(
          { error: "???????????????? ?????? ???????????. ??????????? JPG, PNG ??? WEBP." },
          { status: 400 }
        );
      }

      const approxBytes = Math.ceil((base64Data.length * 3) / 4);
      if (approxBytes > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "?????? ??????????? ?? ?????? ????????? 5 ??" },
          { status: 400 }
        );
      }

      const analysisText = await analyzeImage(base64Data, mimeType, userProfile);
      result = {
        text: analysisText,
        history: [
          ...safeHistory,
          { role: "user", content: message },
          { role: "assistant", content: analysisText },
        ],
      };
    } else {
      result = await generateRecommendation(message, userProfile, safeHistory);
    }

    return NextResponse.json({
      response: result.text,
      history: result.history,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "??????????? ??????";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
