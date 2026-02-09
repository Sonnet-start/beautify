import type { UserProfile } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("name, age, skin_type, skin_problems, allergies, goals")
    .eq("id", userId)
    .single();

  if (error || !profileData) {
    return {
      name: undefined,
      age: undefined,
      skinType: undefined,
      problems: [],
      allergies: undefined,
      goals: [],
    };
  }

  // Use type assertion to handle Supabase row types
  const data = profileData as {
    name: string | null;
    age: number | null;
    skin_type: string | null;
    skin_problems: string[] | null;
    allergies: string | null;
    goals: string[] | null;
  };

  return {
    name: data.name || undefined,
    age: data.age ? String(data.age) : undefined,
    skinType: data.skin_type || undefined,
    problems: data.skin_problems || [],
    allergies: data.allergies || undefined,
    goals: data.goals || [],
  };
}
