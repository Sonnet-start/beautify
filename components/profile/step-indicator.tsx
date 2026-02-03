"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i);

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative flex justify-between">
                {/* Progress line */}
                <div className="absolute top-4 left-0 h-0.5 w-full bg-border/30" />
                <motion.div
                    className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Step circles */}
                {steps.map((step) => {
                    const isCompleted = step < currentStep;
                    const isCurrent = step === currentStep;

                    return (
                        <motion.div
                            key={step}
                            className="relative flex flex-col items-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: step * 0.1 }}
                        >
                            <motion.div
                                className={`
                  h-8 w-8 rounded-full flex items-center justify-center
                  transition-all duration-300 z-10
                  ${isCompleted
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                        : isCurrent
                                            ? "bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background"
                                            : "bg-background border-2 border-border"
                                    }
                `}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                                        {step + 1}
                                    </span>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
