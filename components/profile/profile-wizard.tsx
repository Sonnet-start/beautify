"use client";

import { useProfileStore } from "@/lib/store/profile-store";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepIndicator } from "./step-indicator";
import { AgeStep } from "./steps/age-step";
import { GoalsStep } from "./steps/goals-step";
import { ProblemsStep } from "./steps/problems-step";
import { SkinTypeStep } from "./steps/skin-type-step";
import { SummaryStep } from "./steps/summary-step";
import { WelcomeStep } from "./steps/welcome-step";

interface ProfileWizardProps {
  onComplete?: () => void;
}

export function ProfileWizard({ onComplete }: ProfileWizardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const { currentStep, totalSteps, profileData, nextStep, prevStep, updateProfile, setComplete } =
    useProfileStore();

  async function handleComplete() {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      console.log("Saving profile for user:", user.id, profileData);

      // Save to profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          age: profileData.age,
          skin_type: profileData.skinType,
          skin_problems: profileData.problems,
          allergies: profileData.allergies,
          goals: profileData.goals,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setComplete(true);

      // Give UI a moment to show success state before navigation
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          router.push("/profile");
        }
      }, 500);
    } catch (error) {
      console.error("Profile save error:", error);
      alert("Ошибка при сохранении профиля. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {currentStep > 0 && <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />}

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
