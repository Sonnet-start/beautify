"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const commonGoals = [
  "Увлажнение",
  "Осветление",
  "Ровный тон",
  "Антивозрастной уход",
  "Сияние кожи",
  "Сужение пор",
];

interface GoalsStepProps {
  goals?: string[];
  allergies?: string;
  onChangeGoals: (value: string[]) => void;
  onChangeAllergies: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function GoalsStep({
  goals = [],
  allergies = "",
  onChangeGoals,
  onChangeAllergies,
  onNext,
  onPrev,
}: GoalsStepProps) {
  const [customGoal, setCustomGoal] = useState("");
  const commonGoalSet = useMemo(() => new Set(commonGoals), []);
  const customGoals = goals.filter((goal) => !commonGoalSet.has(goal));

  function toggleGoal(goal: string) {
    if (goals.includes(goal)) {
      onChangeGoals(goals.filter((item) => item !== goal));
    } else {
      onChangeGoals([...goals, goal]);
    }
  }

  function addCustomGoal() {
    const trimmed = customGoal.trim();
    if (!trimmed || goals.includes(trimmed)) return;
    onChangeGoals([...goals, trimmed]);
    setCustomGoal("");
  }

  function handleCustomKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomGoal();
    }
  }

  function removeCustomGoal(goal: string) {
    onChangeGoals(goals.filter((item) => item !== goal));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl font-semibold">Цели и особенности</h2>
        <p className="text-muted-foreground">
          Выберите, что хотите улучшить и укажите особенности
        </p>
      </div>

      <Card glass className="p-6 space-y-6">
        <div className="space-y-3">
          <Label>Цели ухода</Label>
          <div className="flex flex-wrap gap-2">
            {commonGoals.map((goal) => (
              <Button
                key={goal}
                type="button"
                variant={goals.includes(goal) ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={customGoal}
              onChange={(event) => setCustomGoal(event.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="Добавить цель"
            />
            <Button type="button" variant="outline" onClick={addCustomGoal}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {customGoals.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {customGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => removeCustomGoal(goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="allergies">Аллергии (необязательно)</Label>
          <Input
            id="allergies"
            value={allergies}
            onChange={(e) => onChangeAllergies(e.target.value)}
            placeholder="Например: ретинол, витамин C, эфиры..."
          />
          <p className="text-xs text-muted-foreground">
            Это поможет AI рекомендовать безопасные средства для вас
          </p>
        </div>
      </Card>

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
          disabled={goals.length === 0}
        >
          Далее
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
