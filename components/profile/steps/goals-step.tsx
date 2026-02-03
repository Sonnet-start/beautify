"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft } from "lucide-react";

const commonGoals = [
    "Увлажнение",
    "Омоложение",
    "Лечение акне",
    "Выравнивание тона",
    "Сужение пор",
    "Защита от солнца",
];

interface GoalsStepProps {
    goals?: string;
    allergies?: string;
    onChangeGoals: (value: string) => void;
    onChangeAllergies: (value: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function GoalsStep({
    goals = "",
    allergies = "",
    onChangeGoals,
    onChangeAllergies,
    onNext,
    onPrev,
}: GoalsStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="font-serif text-2xl font-semibold">Цели и ограничения</h2>
                <p className="text-muted-foreground">
                    Расскажите о ваших целях и возможных аллергиях
                </p>
            </div>

            <Card glass className="p-6 space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="goals">Основная цель ухода</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {commonGoals.map((goal) => (
                            <Button
                                key={goal}
                                type="button"
                                variant={goals === goal ? "default" : "outline"}
                                size="sm"
                                className="rounded-full text-xs"
                                onClick={() => onChangeGoals(goal)}
                            >
                                {goal}
                            </Button>
                        ))}
                    </div>
                    <Input
                        id="goals"
                        value={goals}
                        onChange={(e) => onChangeGoals(e.target.value)}
                        placeholder="Или введите свою цель..."
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="allergies">Аллергии (опционально)</Label>
                    <Textarea
                        id="allergies"
                        value={allergies}
                        onChange={(e) => onChangeAllergies(e.target.value)}
                        placeholder="Например: ретинол, витамин С, парабены..."
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        Это поможет AI избежать рекомендаций вредных для вас компонентов
                    </p>
                </div>
            </Card>

            <div className="flex gap-3">
                <Button
                    onClick={onPrev}
                    variant="outline"
                    size="lg"
                    className="w-full"
                >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Назад
                </Button>
                <Button
                    onClick={onNext}
                    variant="gradient"
                    size="lg"
                    className="w-full glow"
                    disabled={!goals}
                >
                    Далее
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    );
}
