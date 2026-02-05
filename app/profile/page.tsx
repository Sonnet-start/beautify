"use client";

import { AppNavbar } from "@/components/nav/app-navbar";
import { ProfileWizard } from "@/components/profile/profile-wizard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if user has completed profile
      const hasCompleted = !!(user.user_metadata?.age && user.user_metadata?.skin_type);

      setHasProfile(hasCompleted);
    }

    checkProfile();
  }, [router, supabase]);

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
        title={hasProfile ? "Мой профиль" : "Создание профиля"}
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
          {hasProfile ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Вы уже создали профиль!</p>
              <Link href="/dashboard">
                <Button variant="gradient" className="glow">
                  Вернуться в Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <ProfileWizard />
          )}
        </motion.div>
      </main>
    </div>
  );
}
