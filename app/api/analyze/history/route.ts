import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("photo_analyses")
      .select("id, image_path, analysis_text, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Ошибка загрузки истории" }, { status: 500 });
    }

    // Get signed URLs for images
    const analysesWithUrls = await Promise.all(
      (data || []).map(async (analysis) => {
        if (!analysis.image_path) {
          return { ...analysis, imageUrl: null };
        }

        const { data: urlData } = await supabase.storage
          .from("skin-photos")
          .createSignedUrl(analysis.image_path, 3600); // 1 hour

        return {
          ...analysis,
          imageUrl: urlData?.signedUrl || null,
        };
      })
    );

    return NextResponse.json({ analyses: analysesWithUrls });
  } catch (error) {
    console.error("History Error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
