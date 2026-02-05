"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { ThemeToggle } from "@/components/nav/theme-toggle";
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
  userName?: string | null;
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
  userName,
}: AppNavbarProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = useState<string | null>(userName || null);
  const [isLoading, setIsLoading] = useState(!userName);

  useEffect(() => {
    // If userName is provided, use it and skip loading
    if (userName) {
      setDisplayName(userName);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Subscribe to auth state changes to keep navbar in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        setDisplayName(null);
        setIsLoading(false);
        return;
      }

      const name =
        session.user.user_metadata?.name ??
        session.user.user_metadata?.full_name ??
        session.user.email ??
        "Пользователь";

      setDisplayName(name);
      setIsLoading(false);
    });

    // Initial load
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) return;

      if (!user) {
        setDisplayName(null);
        setIsLoading(false);
        return;
      }

      const name =
        user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? "Пользователь";

      setDisplayName(name);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, userName]);

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
            <span className="font-serif text-2xl">Мой косметолог</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {icon ? (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
              ) : null}
              <div>
                {title ? <h1 className="font-serif text-4xl font-semibold">{title}</h1> : null}
                {subtitle ? <p className="text-base text-muted-foreground">{subtitle}</p> : null}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : displayName ? (
            <UserMenu
              initials={getInitials(displayName)}
              name={displayName}
              onSignOut={handleSignOut}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
