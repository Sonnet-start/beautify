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
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Изображение отсутствует" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Поддерживаются форматы JPEG, PNG и WebP" },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Размер изображения не должен превышать 10 МБ" },
        { status: 400 }
      );
    }

    // Convert to base64 for AI analysis
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Get user profile from profiles table
    const { data: profileData } = await supabase
      .from("profiles")
      .select("age, skin_type, skin_problems, allergies, goals, name")
      .eq("id", user.id)
      .single();

    const userProfile: UserProfile = {
      name: profileData?.name || user.user_metadata?.name,
      age: profileData?.age || user.user_metadata?.age,
      skinType: profileData?.skin_type || user.user_metadata?.skin_type,
      problems: profileData?.skin_problems || [],
      allergies: profileData?.allergies || user.user_metadata?.allergies,
      goals: profileData?.goals || [],
    };

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
      return NextResponse.json(
        { error: `Ошибка загрузки изображения: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Save analysis to database
    const { error: dbError } = await supabase.from("photo_analyses").insert({
      user_id: user.id,
      image_path: uploadData.path,
      analysis_text: analysis,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Try to delete uploaded image if DB insert fails
      await supabase.storage.from("skin-photos").remove([fileName]);
      return NextResponse.json(
        { error: `Ошибка сохранения анализа: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis,
      imagePath: uploadData.path,
    });
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return NextResponse.json({ error: "Ошибка при анализе изображения" }, { status: 500 });
  }
}
