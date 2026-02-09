import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const { analysisId } = await params;

    if (!analysisId) {
      return NextResponse.json({ error: "ID анализа обязателен" }, { status: 400 });
    }

    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    // Get the analysis to find the image path
    // @ts-expect-error - Supabase types issue
    const { data: analysis, error: fetchError } = await supabase
      .from("photo_analyses")
      .select("image_path")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json({ error: "Анализ не найден" }, { status: 404 });
    }

    // Delete image from storage if it exists
    if (analysis.image_path) {
      const { error: storageError } = await supabase.storage
        .from("skin-photos")
        .remove([analysis.image_path]);

      if (storageError) {
        console.error("Failed to delete image from storage:", storageError);
        // Continue to delete DB record even if storage deletion fails
      }
    }

    // Delete the analysis record from database
    // @ts-expect-error - Supabase types issue
    const { error: deleteError } = await supabase
      .from("photo_analyses")
      .delete()
      .eq("id", analysisId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Failed to delete analysis:", deleteError);
      return NextResponse.json({ error: "Ошибка при удалении анализа" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete analysis error:", error);
    return NextResponse.json({ error: "Произошла ошибка при удалении" }, { status: 500 });
  }
}
