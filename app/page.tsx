import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl">РњРѕР№ РєРѕСЃРјРµС‚РѕР»РѕРі</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Р’РѕР№С‚Рё</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="gradient">Р РµРіРёСЃС‚СЂР°С†РёСЏ</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-powered РєРѕСЃРјРµС‚РѕР»РѕРіРёСЏ
          </div>

          <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground">
            РњРѕР№ Р»РёС‡РЅС‹Р№ <span className="gradient-text">РєРѕСЃРјРµС‚РѕР»РѕРі</span>
          </h1>

          <p className="mt-6 text-base leading-7 text-muted-foreground">
            РџРѕР»СѓС‡РёС‚Рµ РїРµСЂСЃРѕРЅР°Р»РёР·РёСЂРѕРІР°РЅРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё РїРѕ СѓС…РѕРґСѓ Р·Р° РєРѕР¶РµР№ РѕС‚ РёСЃРєСѓСЃСЃС‚РІРµРЅРЅРѕРіРѕ
            РёРЅС‚РµР»Р»РµРєС‚Р°. РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹Р№ СѓС…РѕРґ РґРѕСЃС‚СѓРїРµРЅ РєР°Р¶РґРѕРјСѓ.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="xl" variant="gradient" className="glow">
                <Heart className="mr-2 h-5 w-5" />
                РќР°С‡Р°С‚СЊ Р±РµСЃРїР»Р°С‚РЅРѕ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

