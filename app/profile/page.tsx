"use client";

import { AppNavbar } from "@/components/nav/app-navbar";
import { ProfileWizard } from "@/components/profile/profile-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/lib/store/profile-store";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ProfileData {
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

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isWizardMode, setIsWizardMode] = useState(false);

  const { resetProfile, updateProfile, setStep } = useProfileStore();

  const [form, setForm] = useState({
    age: "",
    skinType: "",
    problems: [] as string[],
    extraProblems: "",
    allergies: "",
    goals: [] as string[],
    extraGoals: "",
  });

  const allProblemOptions = useMemo(() => new Set(commonProblems), []);
  const allGoalOptions = useMemo(() => new Set(commonGoals), []);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const metadata = user.user_metadata || {};
      const problems = Array.isArray(metadata.skin_problems)
        ? metadata.skin_problems
        : metadata.skin_problems
          ? [metadata.skin_problems]
          : [];
      const goals = Array.isArray(metadata.goals)
        ? metadata.goals
        : metadata.goals
          ? [metadata.goals]
          : [];

      const loadedProfile: ProfileData = {
        age: metadata.age || "",
        skinType: metadata.skin_type || "",
        problems,
        allergies: metadata.allergies || "",
        goals,
      };

      const extraProblems = problems.filter((item: string) => !allProblemOptions.has(item));
      const extraGoals = goals.filter((item: string) => !allGoalOptions.has(item));

      setProfile(loadedProfile);
      setForm({
        age: loadedProfile.age || "",
        skinType: loadedProfile.skinType || "",
        problems: problems.filter((item: string) => allProblemOptions.has(item)),
        extraProblems: extraProblems.join(", "),
        allergies: loadedProfile.allergies || "",
        goals: goals.filter((item: string) => allGoalOptions.has(item)),
        extraGoals: extraGoals.join(", "),
      });

      const hasCompleted = !!(metadata.age && metadata.skin_type);
      setHasProfile(hasCompleted);
    }

    loadProfile();
  }, [router, supabase, allProblemOptions, allGoalOptions]);

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
      age: profile.age || "",
      skinType: profile.skinType || "",
      problems: existingProblems.filter((item) => allProblemOptions.has(item)),
      extraProblems: existingProblems.filter((item) => !allProblemOptions.has(item)).join(", "),
      allergies: profile.allergies || "",
      goals: existingGoals.filter((item) => allGoalOptions.has(item)),
      extraGoals: existingGoals.filter((item) => !allGoalOptions.has(item)).join(", "),
    });
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSaving(true);

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

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          age: form.age,
          skin_type: form.skinType,
          skin_problems: mergedProblems,
          allergies: form.allergies,
          goals: mergedGoals,
        },
      });

      if (error) throw error;

      const updatedProfile: ProfileData = {
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
    <div className="min-h-screen bg-background">
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
                  <CardTitle className="text-xl">Личные данные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    <div className="space-y-3 text-sm">
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
                        <p className="font-medium">{profile?.allergies || "?"}</p>
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
                        <Label htmlFor="age">Возраст</Label>
                        <Input
                          id="age"
                          value={form.age}
                          onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                          placeholder="Например, 28"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skinType">Тип кожи</Label>
                        <select
                          id="skinType"
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          value={form.skinType}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, skinType: event.target.value }))
                          }
                        >
                          <option value="">Выберите тип кожи</option>
                          {skinTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Проблемы кожи</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {commonProblems.map((problem) => (
                            <label key={problem} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={form.problems.includes(problem)}
                                onChange={() => handleToggleProblem(problem)}
                              />
                              {problem}
                            </label>
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
                              className="rounded-full text-xs"
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
            <ProfileWizard />
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


