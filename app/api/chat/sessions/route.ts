import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    // Get chat sessions with message count
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select(
        `
        id,
        title,
        created_at,
        chat_messages (count)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Ошибка загрузки истории" }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error("Sessions Error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
