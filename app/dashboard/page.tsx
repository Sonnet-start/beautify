import { FeatureCard } from "@/components/dashboard/feature-card";
import { AppNavbar } from "@/components/nav/app-navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const displayName =
    user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? "Пользователь";

  const features = [
    {
      iconName: "MessageCircle" as const,
      title: "ИИ‑Консультация",
      description: "Получите персональные рекомендации",
      href: "/consultation",
      available: true,
      requiresDisclaimer: true,
    },
    {
      iconName: "Camera" as const,
      title: "Анализ фото",
      description: "Загрузите фото для анализа кожи",
      href: "/analysis",
      available: true,
      requiresDisclaimer: true,
    },
    {
      iconName: "Calendar" as const,
      title: "Календарь ухода",
      description: "Запланируйте процедуры",
      href: "/calendar",
      available: true,
      requiresDisclaimer: false,
    },
    {
      iconName: "User" as const,
      title: "Мой профиль",
      description: "Настройте данные о вашей коже",
      href: "/profile",
      available: true,
      requiresDisclaimer: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      {/* Header */}
      <AppNavbar variant="brand" />
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-4xl mb-2">Привет, {displayName}! 👋</h1>
          <p className="text-muted-foreground text-base">Выберите, с чего хотите начать сегодня</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              available={feature.available}
              requiresDisclaimer={feature.requiresDisclaimer}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
