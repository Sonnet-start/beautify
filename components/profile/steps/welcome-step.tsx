"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface WelcomeStepProps {
    onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-lg"
                >
                    <Sparkles className="h-10 w-10 text-primary" />
                </motion.div>

                <div>
                    <h2 className="font-serif text-3xl font-semibold mb-2">Добро пожаловать!</h2>
                    <p className="text-muted-foreground text-lg">
                        Давайте создадим ваш персональный профиль
                    </p>
                </div>
            </div>

            <Card glass className="p-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Чтобы AI-косметолог давал максимально точные рекомендации,
                        нам нужно узнать о вашей коже немного больше.
                    </p>
                    <p>
                        Это займет всего <strong className="text-foreground">2-3 минуты</strong>.
                        Все данные конфиденциальны и используются только для персонализации советов.
                    </p>
                </div>
            </Card>

            <Button
                onClick={onNext}
                size="lg"
                variant="gradient"
                className="w-full glow"
            >
                Начать
            </Button>
        </motion.div>
    );
}
