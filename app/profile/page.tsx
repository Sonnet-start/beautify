"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const skinTypes = [
    { value: "normal", label: "Нормальная" },
    { value: "dry", label: "Сухая" },
    { value: "oily", label: "Жирная" },
    { value: "combination", label: "Комбинированная" },
    { value: "sensitive", label: "Чувствительная" },
];

const skinProblems = [
    { value: "acne", label: "Акне" },
    { value: "wrinkles", label: "Морщины" },
    { value: "pigmentation", label: "Пигментация" },
    { value: "redness", label: "Покраснения" },
    { value: "pores", label: "Расширенные поры" },
    { value: "dryness", label: "Сухость/шелушение" },
    { value: "oiliness", label: "Жирный блеск" },
];

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        skinType: "",
        problems: [] as string[],
        allergies: "",
        goals: "",
    });

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Load profile from user metadata or database
            if (user.user_metadata) {
                setProfile({
                    name: user.user_metadata.name || "",
                    age: user.user_metadata.age || "",
                    skinType: user.user_metadata.skin_type || "",
                    problems: user.user_metadata.skin_problems || [],
                    allergies: user.user_metadata.allergies || "",
                    goals: user.user_metadata.goals || "",
                });
            }
        }

        loadProfile();
    }, [router, supabase]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
            data: {
                name: profile.name,
                age: profile.age,
                skin_type: profile.skinType,
                skin_problems: profile.problems,
                allergies: profile.allergies,
                goals: profile.goals,
            },
        });

        setIsLoading(false);

        if (!error) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    }

    function toggleProblem(value: string) {
        setProfile(prev => ({
            ...prev,
            problems: prev.problems.includes(value)
                ? prev.problems.filter(p => p !== value)
                : [...prev.problems, value]
        }));
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="font-serif text-xl">Мой профиль</h1>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <Card glass>
                            <CardHeader>
                                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Личные данные</CardTitle>
                                <CardDescription>Расскажите немного о себе</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Имя</Label>
                                        <Input
                                            id="name"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            placeholder="Ваше имя"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Возраст</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            value={profile.age}
                                            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                            placeholder="25"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skin Type */}
                        <Card glass>
                            <CardHeader>
                                <CardTitle>Тип кожи</CardTitle>
                                <CardDescription>Выберите ваш тип кожи</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {skinTypes.map((type) => (
                                        <Button
                                            key={type.value}
                                            type="button"
                                            variant={profile.skinType === type.value ? "default" : "outline"}
                                            onClick={() => setProfile({ ...profile, skinType: type.value })}
                                            className="rounded-full"
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skin Problems */}
                        <Card glass>
                            <CardHeader>
                                <CardTitle>Проблемы кожи</CardTitle>
                                <CardDescription>Выберите все, что вас беспокоит</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {skinProblems.map((problem) => (
                                        <Button
                                            key={problem.value}
                                            type="button"
                                            variant={profile.problems.includes(problem.value) ? "default" : "outline"}
                                            onClick={() => toggleProblem(problem.value)}
                                            className="rounded-full"
                                        >
                                            {problem.label}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card glass>
                            <CardHeader>
                                <CardTitle>Дополнительно</CardTitle>
                                <CardDescription>Помогите нам лучше понять ваши потребности</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="allergies">Аллергии (если есть)</Label>
                                    <Input
                                        id="allergies"
                                        value={profile.allergies}
                                        onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                                        placeholder="Например: ретинол, витамин С..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goals">Цели ухода</Label>
                                    <Input
                                        id="goals"
                                        value={profile.goals}
                                        onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
                                        placeholder="Например: увлажнение, омоложение..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <Button
                            type="submit"
                            size="lg"
                            variant="gradient"
                            className="w-full glow"
                            disabled={isLoading}
                        >
                            {isLoading ? "Сохранение..." : isSaved ? "Сохранено ✓" : "Сохранить профиль"}
                            {!isLoading && !isSaved && <Save className="ml-2 h-5 w-5" />}
                        </Button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
