import { create } from "zustand";

export interface ProfileData {
  name?: string;
  age?: string;
  skinType?: string;
  problems?: string[];
  allergies?: string;
  goals?: string;
}

interface ProfileStoreState {
  currentStep: number;
  totalSteps: number;
  profileData: ProfileData;
  isComplete: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  resetProfile: () => void;
  setComplete: (complete: boolean) => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  currentStep: 0,
  totalSteps: 6,
  profileData: {
    problems: [],
  },
  isComplete: false,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  updateProfile: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),

  resetProfile: () =>
    set({
      currentStep: 0,
      profileData: { problems: [] },
      isComplete: false,
    }),

  setComplete: (complete) => set({ isComplete: complete }),
}));
