"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ageRanges = [
  { value: "18-25", label: "18-25 лет", emoji: "✨" },
  { value: "26-35", label: "26-35 лет", emoji: "🌟" },
  { value: "36-45", label: "36-45 лет", emoji: "💫" },
  { value: "46+", label: "46+ лет", emoji: "👑" },
];

interface AgeStepProps {
  value?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AgeStep({ value, onChange, onNext, onPrev }: AgeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl font-semibold">Ваш возраст</h2>
        <p className="text-muted-foreground">Потребности кожи меняются с возрастом</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ageRanges.map((range, index) => (
          <motion.div
            key={range.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              glass={value === range.value}
              className={`
                p-6 cursor-pointer transition-all hover:scale-105
                ${
                  value === range.value
                    ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                    : "hover:shadow-md"
                }
              `}
              onClick={() => onChange(range.value)}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{range.emoji}</div>
                <p className="font-medium">{range.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" size="lg" className="w-full">
          <ChevronLeft className="mr-2 h-5 w-5" />
          Назад
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          size="lg"
          className="w-full glow"
          disabled={!value}
        >
          Далее
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
