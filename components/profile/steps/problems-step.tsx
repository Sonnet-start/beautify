"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";

const commonProblems = [
    { value: "Акне", label: "Акне", emoji: "🔴" },
    { value: "Морщины", label: "Морщины", emoji: "📏" },
    { value: "Пигментация", label: "Пигментация", emoji: "☀️" },
    { value: "Покраснения", label: "Покраснения", emoji: "🌹" },
    { value: "Расширенные поры", label: "Расширенные поры", emoji: "🔍" },
    { value: "Сухость", label: "Сухость/шелушение", emoji: "🏜️" },
    { value: "Жирный блеск", label: "Жирный блеск", emoji: "✨" },
    { value: "Тусклость", label: "Тусклость", emoji: "🌫️" },
];

interface ProblemsStepProps {
    value?: string[];
    onChange: (value: string[]) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function ProblemsStep({ value = [], onChange, onNext, onPrev }: ProblemsStepProps) {
    const toggleProblem = (problem: string) => {
        if (value.includes(problem)) {
            onChange(value.filter((p) => p !== problem));
        } else {
            onChange([...value, problem]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="font-serif text-2xl font-semibold">Проблемы кожи</h2>
                <p className="text-muted-foreground">
                    Выберите все, что вас беспокоит (можно несколько)
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {commonProblems.map((problem, index) => {
                    const isSelected = value.includes(problem.value);

                    return (
                        <motion.div
                            key={problem.value}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                glass={isSelected}
                                className={`
                  p-4 cursor-pointer transition-all hover:scale-105
                  ${isSelected
                                        ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                                        : "hover:shadow-md"
                                    }
                `}
                                onClick={() => toggleProblem(problem.value)}
                            >
                                <div className="text-center space-y-2">
                                    <div className="text-2xl">{problem.emoji}</div>
                                    <p className="text-sm font-medium">{problem.label}</p>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {value.length > 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-muted-foreground"
                >
                    Выбрано: {value.length}
                </motion.p>
            )}

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
                >
                    Далее
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    );
}
