"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { UserMenu } from "@/components/nav/user-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppNavbarProps = {
  variant?: "brand" | "page";
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  backHref?: string;
  containerClassName?: string;
};

function getInitials(name: string) {
  const cleaned = name.replace(/@.*/, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function AppNavbar({
  variant = "page",
  title,
  subtitle,
  icon,
  backHref = "/dashboard",
  containerClassName,
}: AppNavbarProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (!user) {
        setDisplayName(null);
        return;
      }

      const name =
        user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? "Пользователь";

      setDisplayName(name);
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-40 shadow-sm">
      <div
        className={cn(
          "max-w-5xl mx-auto px-6 py-4 flex items-center justify-between",
          containerClassName
        )}
      >
        {variant === "brand" ? (
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl">Мой косметолог</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {icon ? (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
              ) : null}
              <div>
                {title ? <h1 className="font-serif text-lg font-semibold">{title}</h1> : null}
                {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>
          </div>
        )}

        {displayName ? (
          <UserMenu
            initials={getInitials(displayName)}
            name={displayName}
            onSignOut={handleSignOut}
          />
        ) : null}
      </div>
    </header>
  );
}
