import { type UserProfile, analyzeImage } from "@/lib/ai/gemini";
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

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "??????????? ???????????" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "?????????????? ?????? JPEG, PNG ? WebP" },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "?????? ??????????? ?? ?????? ????????? 10 ??" },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

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

    // Analyze image with Gemini Vision
    const analysis = await analyzeImage(base64, file.type, userProfile);

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return NextResponse.json(
      { error: "?????? ??? ??????? ???????????" },
      { status: 500 }
    );
  }
}
