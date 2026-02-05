"use client";

import { DisclaimerModal } from "@/components/ui/disclaimer-modal";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

interface DisclaimerProviderProps {
  children: ReactNode;
}

interface DisclaimerContextType {
  isDisclaimerAccepted: boolean | null;
  requireDisclaimer: () => Promise<boolean>;
}

const DisclaimerContext = createContext<DisclaimerContextType | null>(null);

export function useDisclaimer() {
  const context = useContext(DisclaimerContext);
  if (!context) {
    throw new Error("useDisclaimer must be used within DisclaimerProvider");
  }
  return context;
}

export function DisclaimerProvider({ children }: DisclaimerProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      console.log("Checking user...");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("User from getUser:", user?.id);
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("disclaimer_accepted_at")
          .eq("id", user.id)
          .maybeSingle();

        console.log("Profile disclaimer status:", profile?.disclaimer_accepted_at);
        setIsDisclaimerAccepted(profile?.disclaimer_accepted_at != null);
      } else {
        setIsDisclaimerAccepted(null);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("disclaimer_accepted_at")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!existingUser) {
          await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name ?? session.user.email?.split("@")[0],
            avatar_url: session.user.user_metadata?.avatar_url,
          });
          setIsDisclaimerAccepted(false);
        } else {
          setIsDisclaimerAccepted(existingUser.disclaimer_accepted_at != null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const requireDisclaimer = useCallback((): Promise<boolean> => {
    if (isDisclaimerAccepted === true) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
      setShowModal(true);
    });
  }, [isDisclaimerAccepted]);

  const handleAccept = async () => {
    if (!user) {
      console.error("No user found");
      return;
    }

    console.log("Accepting disclaimer for user:", user.id);

    try {
      const response = await fetch("/api/disclaimer/accept", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to accept disclaimer");
      }

      console.log("Disclaimer accepted successfully");
      setIsDisclaimerAccepted(true);
      setShowModal(false);
      resolvePromise?.(true);
      setResolvePromise(null);
    } catch (error) {
      console.error("Failed to accept disclaimer:", error);
      alert("Ошибка при сохранении. Попробуйте еще раз.");
    }
  };

  return (
    <DisclaimerContext.Provider value={{ isDisclaimerAccepted, requireDisclaimer }}>
      {children}
      <DisclaimerModal isOpen={showModal} onAccept={handleAccept} />
    </DisclaimerContext.Provider>
  );
}
