import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("users")
      .update({ disclaimer_accepted_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating disclaimer:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disclaimer accept error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
