import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/app/auth/actions";
import { Sparkles, User, Camera, Calendar, MessageCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const features = [
        {
            icon: MessageCircle,
            title: "AI-Консультация",
            description: "Получите персональные рекомендации",
            href: "/consultation",
            available: true
        },
        {
            icon: Camera,
            title: "Анализ фото",
            description: "Загрузите фото для анализа кожи",
            href: "/analysis",
            available: true
        },
        {
            icon: Calendar,
            title: "Календарь ухода",
            description: "Запланируйте процедуры",
            href: "/calendar",
            available: true
        },
        {
            icon: User,
            title: "Мой профиль",
            description: "Настройте данные о вашей коже",
            href: "/profile",
            available: true
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="font-serif text-xl">Мой косметолог</span>
                    </div>
                    <form action={signOut}>
                        <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4 mr-2" />
                            Выйти
                        </Button>
                    </form>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="font-serif text-4xl mb-2">
                        Привет{user.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Выберите, с чего хотите начать сегодня
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {features.map((feature) => (
                        <Link
                            key={feature.title}
                            href={feature.available ? feature.href : "#"}
                            className={feature.available ? "" : "cursor-not-allowed"}
                        >
                            <Card
                                glass
                                className={`h-full transition-all duration-300 ${feature.available
                                    ? "hover:shadow-xl hover:scale-[1.02]"
                                    : "opacity-60"
                                    }`}
                            >
                                <CardHeader>
                                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        {feature.title}
                                        {!feature.available && (
                                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                Скоро
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
