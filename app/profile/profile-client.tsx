"use client";

import { AppNavbar } from "@/components/nav/app-navbar";
import { ProfileWizard } from "@/components/profile/profile-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/lib/store/profile-store";
import { createClient } from "@/lib/supabase/client";
import type { TablesUpdate } from "@/lib/supabase/database.types";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ProfileData {
  name?: string;
  age?: string;
  skinType?: string;
  problems?: string[];
  allergies?: string;
  goals?: string[];
}

const skinTypeOptions = ["Нормальная", "Сухая", "Жирная", "Комбинированная", "Чувствительная"];

const commonProblems = [
  "Акне",
  "Прыщи",
  "Пигментация",
  "Морщины",
  "Расширенные поры",
  "Сухость/шелушение",
  "Тусклый тон",
  "Покраснение",
];

const commonGoals = [
  "Увлажнение",
  "Осветление",
  "Ровный тон",
  "Антивозрастной уход",
  "Сияние кожи",
  "Сужение пор",
];

const allProblemOptionsSet = new Set(commonProblems);
const allGoalOptionsSet = new Set(commonGoals);

interface ProfileClientProps {
  userId: string;
  userName: string;
  initialProfile: {
    name: string | null;
    age: string | null;
    skin_type: string | null;
    skin_problems: string[] | null;
    allergies: string | null;
    goals: string[] | null;
  } | null;
}

export function ProfileClient({ userId, userName, initialProfile }: ProfileClientProps) {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isWizardMode, setIsWizardMode] = useState(false);

  const { resetProfile, updateProfile, setStep } = useProfileStore();

  const [form, setForm] = useState({
    name: "",
    age: "",
    skinType: "",
    problems: [] as string[],
    extraProblems: "",
    allergies: "",
    goals: [] as string[],
    extraGoals: "",
  });

  const loadProfile = useCallback(async () => {
    console.log("Loading profile for user:", userId);

    // Use initial profile data from server
    if (initialProfile) {
      console.log("Using initial profile data:", initialProfile);

      // Type assertion for database response
      type DbProfile = {
        name: string | null;
        age: string | null;
        skin_type: string | null;
        skin_problems: string[] | null;
        allergies: string | null;
        goals: string[] | null;
      };

      const dbProfile = initialProfile as DbProfile;
      const problems = dbProfile.skin_problems || [];
      const goals = dbProfile.goals || [];

      const loadedProfile: ProfileData = {
        name: dbProfile.name || "",
        age: dbProfile.age || "",
        skinType: dbProfile.skin_type || "",
        problems,
        allergies: dbProfile.allergies || "",
        goals,
      };

      const extraProblems = problems.filter((item: string) => !allProblemOptionsSet.has(item));
      const extraGoals = goals.filter((item: string) => !allGoalOptionsSet.has(item));

      setProfile(loadedProfile);
      setForm({
        name: loadedProfile.name || "",
        age: loadedProfile.age || "",
        skinType: loadedProfile.skinType || "",
        problems: problems.filter((item: string) => allProblemOptionsSet.has(item)),
        extraProblems: extraProblems.join(", "),
        allergies: loadedProfile.allergies || "",
        goals: goals.filter((item: string) => allGoalOptionsSet.has(item)),
        extraGoals: extraGoals.join(", "),
      });

      const hasCompleted = Boolean(
        loadedProfile.age &&
        typeof loadedProfile.age === "string" &&
        loadedProfile.age.trim().length > 0 &&
        loadedProfile.skinType &&
        typeof loadedProfile.skinType === "string" &&
        loadedProfile.skinType.trim().length > 0
      );
      console.log("Profile check:", {
        age: loadedProfile.age,
        skinType: loadedProfile.skinType,
        hasCompleted,
      });
      setHasProfile(hasCompleted);
      return;
    }

    // Fallback: try to load from client (shouldn't happen)
    console.log("No initial profile, loading from client...");
    const supabase = createClient();

    try {
      // Check session first
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session:", session ? "exists" : "missing");

      if (!session) {
        console.error("No session found!");
        setHasProfile(false);
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Profile data from DB:", profileData);
      console.log("Profile error:", error);

      if (error) {
        console.error("Error loading profile from DB:", error);
        if (error.code === "PGRST116") {
          setHasProfile(false);
          return;
        }
      }

      if (!profileData) {
        console.log("No profile data found");
        setHasProfile(false);
        return;
      }

      // Type assertion for database response
      type DbProfile = {
        age: string | null;
        skin_type: string | null;
        skin_problems: string[] | null;
        allergies: string | null;
        goals: string[] | null;
      };

      const dbProfile = profileData as unknown as DbProfile;
      const problems = dbProfile.skin_problems || [];
      const goals = dbProfile.goals || [];

      const loadedProfile: ProfileData = {
        age: dbProfile.age || "",
        skinType: dbProfile.skin_type || "",
        problems,
        allergies: dbProfile.allergies || "",
        goals,
      };

      const extraProblems = problems.filter((item: string) => !allProblemOptionsSet.has(item));
      const extraGoals = goals.filter((item: string) => !allGoalOptionsSet.has(item));

      setProfile(loadedProfile);
      setForm({
        name: loadedProfile.name || "",
        age: loadedProfile.age || "",
        skinType: loadedProfile.skinType || "",
        problems: problems.filter((item: string) => allProblemOptionsSet.has(item)),
        extraProblems: extraProblems.join(", "),
        allergies: loadedProfile.allergies || "",
        goals: goals.filter((item: string) => allGoalOptionsSet.has(item)),
        extraGoals: extraGoals.join(", "),
      });

      const hasCompleted = Boolean(
        loadedProfile.age &&
        typeof loadedProfile.age === "string" &&
        loadedProfile.age.trim().length > 0 &&
        loadedProfile.skinType &&
        typeof loadedProfile.skinType === "string" &&
        loadedProfile.skinType.trim().length > 0
      );
      console.log("Profile check:", {
        age: loadedProfile.age,
        ageType: typeof loadedProfile.age,
        skinType: loadedProfile.skinType,
        skinTypeType: typeof loadedProfile.skinType,
        hasCompleted,
      });
      setHasProfile(hasCompleted);
    } catch (error) {
      console.error("Profile load exception:", error);
      setHasProfile(false);
    }
  }, [userId, initialProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function handleToggleProblem(value: string) {
    setForm((prev) => {
      const exists = prev.problems.includes(value);
      const next = exists ? prev.problems.filter((p) => p !== value) : [...prev.problems, value];
      return { ...prev, problems: next };
    });
  }

  function handleToggleGoal(value: string) {
    setForm((prev) => {
      const exists = prev.goals.includes(value);
      const next = exists ? prev.goals.filter((g) => g !== value) : [...prev.goals, value];
      return { ...prev, goals: next };
    });
  }

  function handleStartWizard() {
    if (profile) {
      resetProfile();
      updateProfile({
        age: profile.age,
        skinType: profile.skinType,
        problems: profile.problems || [],
        allergies: profile.allergies,
        goals: profile.goals || [],
      });
      setStep(0);
    }

    setIsWizardMode(true);
  }

  function handleCancelEdit() {
    if (!profile) return;

    const existingProblems = profile.problems || [];
    const existingGoals = profile.goals || [];

    setForm({
      name: profile.name || "",
      age: profile.age || "",
      skinType: profile.skinType || "",
      problems: existingProblems.filter((item) => allProblemOptionsSet.has(item)),
      extraProblems: existingProblems.filter((item) => !allProblemOptionsSet.has(item)).join(", "),
      allergies: profile.allergies || "",
      goals: existingGoals.filter((item) => allGoalOptionsSet.has(item)),
      extraGoals: existingGoals.filter((item) => !allGoalOptionsSet.has(item)).join(", "),
    });
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSaving(true);
    const supabase = createClient();

    try {
      const extraProblems = form.extraProblems
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const extraGoals = form.extraGoals
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const mergedProblems = [...form.problems, ...extraProblems];
      const mergedGoals = [...form.goals, ...extraGoals];

      const updateData: TablesUpdate<"profiles"> = {
        name: form.name,
        age: form.age,
        skin_type: form.skinType,
        skin_problems: mergedProblems,
        allergies: form.allergies,
        goals: mergedGoals,
        updated_at: new Date().toISOString(),
      };

      // @ts-expect-error - Supabase types issue
      const { error } = await supabase.from("profiles").update(updateData).eq("id", userId);

      if (error) throw error;

      const updatedProfile: ProfileData = {
        name: form.name,
        age: form.age,
        skinType: form.skinType,
        problems: mergedProblems,
        allergies: form.allergies,
        goals: mergedGoals,
      };

      setProfile(updatedProfile);
      setIsEditing(false);
      setHasProfile(!!(form.age && form.skinType));
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Ошибка при обновлении профиля. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  }

  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <AppNavbar
        variant="page"
        title={hasProfile ? "Ваш профиль" : "Создание профиля"}
        icon={<User className="h-5 w-5 text-primary" />}
        backHref="/dashboard"
        containerClassName="max-w-3xl"
        userName={userName}
      />

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hasProfile && !isWizardMode ? (
            <div className="space-y-6">
              <Card glass>
                <CardHeader>
                  <CardTitle className="text-lg">Личные данные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    <div className="space-y-3 text-base">
                      <div>
                        <p className="text-muted-foreground">Имя</p>
                        <p className="font-medium">{profile?.name || "?"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Возраст</p>
                        <p className="font-medium">{profile?.age || "?"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Тип кожи</p>
                        <p className="font-medium">{profile?.skinType || "?"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Проблемы</p>
                        <p className="font-medium">
                          {profile?.problems?.length ? profile.problems.join(", ") : "?"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Аллергии</p>
                        <p className="font-medium">{profile?.allergies || "Нет"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Цели</p>
                        <p className="font-medium">
                          {profile?.goals?.length ? profile.goals.join(", ") : "?"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          placeholder="Ваше имя"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Возраст</Label>
                        <Input
                          id="age"
                          value={form.age}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, age: event.target.value }))
                          }
                          placeholder="Например, 28"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skinType">Тип кожи</Label>
                        <Select
                          value={form.skinType}
                          onValueChange={(value) =>
                            setForm((prev) => ({ ...prev, skinType: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип кожи" />
                          </SelectTrigger>
                          <SelectContent>
                            {skinTypeOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Проблемы кожи</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {commonProblems.map((problem) => (
                            <div key={problem} className="flex items-center gap-3">
                              <Checkbox
                                id={`problem-${problem}`}
                                checked={form.problems.includes(problem)}
                                onCheckedChange={() => handleToggleProblem(problem)}
                              />
                              <label
                                htmlFor={`problem-${problem}`}
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {problem}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="extraProblems">Другие проблемы</Label>
                        <Input
                          id="extraProblems"
                          value={form.extraProblems}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, extraProblems: event.target.value }))
                          }
                          placeholder="Опишите проблемы"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Цели ухода</Label>
                        <div className="flex flex-wrap gap-2">
                          {commonGoals.map((goal) => (
                            <Button
                              key={goal}
                              type="button"
                              variant={form.goals.includes(goal) ? "default" : "outline"}
                              size="sm"
                              className="rounded-full text-sm"
                              onClick={() => handleToggleGoal(goal)}
                            >
                              {goal}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="extraGoals">Другие цели</Label>
                        <Input
                          id="extraGoals"
                          value={form.extraGoals}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, extraGoals: event.target.value }))
                          }
                          placeholder="Опишите цели"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Аллергии</Label>
                        <Textarea
                          id="allergies"
                          value={form.allergies}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, allergies: event.target.value }))
                          }
                          placeholder="Например: ретинол или витамин C"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Редактировать
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                          Отмена
                        </Button>
                        <Button variant="gradient" className="glow" onClick={handleSave}>
                          {isSaving ? "Сохраняем..." : "Сохранить"}
                        </Button>
                      </>
                    )}

                    <Button variant="gradient" className="glow" onClick={handleStartWizard}>
                      Заполнить анкету заново
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ProfileWizard
              onComplete={async () => {
                await loadProfile();
                setIsWizardMode(false);
                setHasProfile(true);
              }}
            />
          )}

          {hasProfile && isWizardMode && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setIsWizardMode(false)}>
                Вернуться к профилю
              </Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
