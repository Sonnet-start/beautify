"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/lib/store/profile-store";
import { StepIndicator } from "./step-indicator";
import { WelcomeStep } from "./steps/welcome-step";
import { AgeStep } from "./steps/age-step";
import { SkinTypeStep } from "./steps/skin-type-step";
import { ProblemsStep } from "./steps/problems-step";
import { GoalsStep } from "./steps/goals-step";
import { SummaryStep } from "./steps/summary-step";
import { createClient } from "@/lib/supabase/client";

export function ProfileWizard() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const {
        currentStep,
        totalSteps,
        profileData,
        nextStep,
        prevStep,
        updateProfile,
        setComplete,
    } = useProfileStore();

    async function handleComplete() {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    age: profileData.age,
                    skin_type: profileData.skinType,
                    skin_problems: profileData.problems,
                    allergies: profileData.allergies,
                    goals: profileData.goals,
                },
            });

            if (error) throw error;

            setComplete(true);
            router.push("/dashboard");
        } catch (error) {
            console.error("Profile save error:", error);
            alert("Ошибка при сохранении профиля. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {currentStep > 0 && (
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            )}

            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && <WelcomeStep key="welcome" onNext={nextStep} />}

                    {currentStep === 1 && (
                        <AgeStep
                            key="age"
                            value={profileData.age}
                            onChange={(value) => updateProfile({ age: value })}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {currentStep === 2 && (
                        <SkinTypeStep
                            key="skinType"
                            value={profileData.skinType}
                            onChange={(value) => updateProfile({ skinType: value })}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {currentStep === 3 && (
                        <ProblemsStep
                            key="problems"
                            value={profileData.problems}
                            onChange={(value) => updateProfile({ problems: value })}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {currentStep === 4 && (
                        <GoalsStep
                            key="goals"
                            goals={profileData.goals}
                            allergies={profileData.allergies}
                            onChangeGoals={(value) => updateProfile({ goals: value })}
                            onChangeAllergies={(value) => updateProfile({ allergies: value })}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {currentStep === 5 && (
                        <SummaryStep
                            key="summary"
                            data={profileData}
                            onPrev={prevStep}
                            onComplete={handleComplete}
                            isLoading={isLoading}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
