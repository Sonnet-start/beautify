import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, title")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Сессия не найдена" }, { status: 404 });
    }

    // Get messages for this session
    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Database error:", messagesError);
      return NextResponse.json({ error: "Ошибка загрузки сообщений" }, { status: 500 });
    }

    return NextResponse.json({
      session,
      messages: messages || [],
    });
  } catch (error) {
    console.error("Session Messages Error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
