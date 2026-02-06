"use client";

import { useDisclaimer } from "@/components/providers/disclaimer-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Camera, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";

const iconMap = {
  MessageCircle,
  Camera,
  Calendar,
  User,
} as const;

type IconName = keyof typeof iconMap;

interface FeatureCardProps {
  iconName: IconName;
  title: string;
  description: string;
  href: string;
  available: boolean;
  requiresDisclaimer?: boolean;
}

export function FeatureCard({
  iconName,
  title,
  description,
  href,
  available,
  requiresDisclaimer = false,
}: FeatureCardProps) {
  const router = useRouter();
  const { requireDisclaimer } = useDisclaimer();
  const Icon = iconMap[iconName];

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!available) return;

    if (requiresDisclaimer) {
      const accepted = await requireDisclaimer();
      if (!accepted) return;
    }

    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!available}
      className={`w-full text-left ${available ? "cursor-pointer" : "cursor-not-allowed"}`}
    >
      <Card
        glass
        className={`h-full transition-all duration-300 ${available ? "hover:shadow-xl hover:scale-[1.02]" : "opacity-60"
          }`}
      >
        <CardHeader>
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {!available && (
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Скоро
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </button>
  );
}
