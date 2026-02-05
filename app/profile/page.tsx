import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Load profile data on server
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName =
    user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? "Пользователь";

  return <ProfileClient userId={user.id} userName={userName} initialProfile={profileData} />;
}
