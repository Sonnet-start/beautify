import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppNavbar } from "@/components/nav/app-navbar";
import { User, Camera, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const displayName =
        user.user_metadata?.name ??
        user.user_metadata?.full_name ??
        user.email ??
        "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ";

    const features = [
        {
            icon: MessageCircle,
            title: "AI-РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ",
            description: "РџРѕР»СѓС‡РёС‚Рµ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё",
            href: "/consultation",
            available: true
        },
        {
            icon: Camera,
            title: "РђРЅР°Р»РёР· С„РѕС‚Рѕ",
            description: "Р—Р°РіСЂСѓР·РёС‚Рµ С„РѕС‚Рѕ РґР»СЏ Р°РЅР°Р»РёР·Р° РєРѕР¶Рё",
            href: "/analysis",
            available: true
        },
        {
            icon: Calendar,
            title: "РљР°Р»РµРЅРґР°СЂСЊ СѓС…РѕРґР°",
            description: "Р—Р°РїР»Р°РЅРёСЂСѓР№С‚Рµ РїСЂРѕС†РµРґСѓСЂС‹",
            href: "/calendar",
            available: true
        },
        {
            icon: User,
            title: "РњРѕР№ РїСЂРѕС„РёР»СЊ",
            description: "РќР°СЃС‚СЂРѕР№С‚Рµ РґР°РЅРЅС‹Рµ Рѕ РІР°С€РµР№ РєРѕР¶Рµ",
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

            {/* Header */}\n            <AppNavbar variant="brand" />

            {/* Main content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="font-serif text-4xl mb-2">
                        РџСЂРёРІРµС‚{user.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}! рџ‘‹
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Р’С‹Р±РµСЂРёС‚Рµ, СЃ С‡РµРіРѕ С…РѕС‚РёС‚Рµ РЅР°С‡Р°С‚СЊ СЃРµРіРѕРґРЅСЏ
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
                                                РЎРєРѕСЂРѕ
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

