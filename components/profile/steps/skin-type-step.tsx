"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const skinTypes = [
  {
    value: "Нормальная",
    label: "Нормальная",
    description: "Сбалансированная, без выраженных проблем",
    emoji: "🙂",
  },
  { value: "Сухая", label: "Сухая", description: "Склонна к шелушению", emoji: "😌" },
  { value: "Жирная", label: "Жирная", description: "Блеск, расширенные поры", emoji: "😅" },
  {
    value: "Комбинированная",
    label: "Комбинированная",
    description: "Т-зона жирная, щеки сухие",
    emoji: "🤔",
  },
  {
    value: "Чувствительная",
    label: "Чувствительная",
    description: "Легко раздражается, краснеет",
    emoji: "😟",
  },
];

interface SkinTypeStepProps {
  value?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SkinTypeStep({ value, onChange, onNext, onPrev }: SkinTypeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Ваш тип кожи</h2>
        <p className="text-muted-foreground">Выберите наиболее подходящий вариант</p>
      </div>

      <div className="space-y-3">
        {skinTypes.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card
              glass={value === type.value}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                value === type.value
                  ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                  : "hover:shadow-md"
              }`}
              onClick={() => onChange(type.value)}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{type.emoji}</div>
                <div className="flex-1">
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                {value === type.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg
                      className="h-4 w-4 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      role="img"
                    >
                      <title>Выбрано</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
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
