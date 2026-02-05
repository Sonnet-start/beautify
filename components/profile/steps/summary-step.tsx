"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProfileData } from "@/lib/store/profile-store";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";

interface SummaryStepProps {
  data: ProfileData;
  onPrev: () => void;
  onComplete: () => void;
  isLoading?: boolean;
}

export function SummaryStep({ data, onPrev, onComplete, isLoading }: SummaryStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-lg mb-4"
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-semibold">Все готово!</h2>
        <p className="text-muted-foreground">Проверьте вашу анкету перед сохранением</p>
      </div>

      <Card glass className="p-6 space-y-4">
        {data.age && (
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Возраст</span>
            <span className="font-medium">{data.age} лет</span>
          </div>
        )}

        {data.skinType && (
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Тип кожи</span>
            <span className="font-medium">{data.skinType}</span>
          </div>
        )}

        {data.problems && data.problems.length > 0 && (
          <div className="py-2 border-b border-border/30">
            <span className="text-muted-foreground block mb-2">Проблемы</span>
            <div className="flex flex-wrap gap-2">
              {data.problems.map((problem) => (
                <span
                  key={problem}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {problem}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.goals && data.goals.length > 0 && (
          <div className="py-2 border-b border-border/30">
            <span className="text-muted-foreground block mb-2">Цели ухода</span>
            <div className="flex flex-wrap gap-2">
              {data.goals.map((goal) => (
                <span
                  key={goal}
                  className="text-xs px-2 py-1 rounded-full bg-accent/20 text-foreground"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.allergies && (
          <div className="py-2">
            <span className="text-muted-foreground block mb-1">Аллергии</span>
            <span className="text-sm">{data.allergies}</span>
          </div>
        )}
      </Card>

      <Card glass className="p-4 bg-primary/5">
        <p className="text-sm text-center">
          Все отлично! Теперь AI сможет давать персонализированные рекомендации, учитывая ваши
          особенности кожи.
        </p>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Назад
        </Button>
        <Button
          onClick={onComplete}
          variant="gradient"
          size="lg"
          className="w-full glow"
          disabled={isLoading}
        >
          {isLoading ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>
    </motion.div>
  );
}
