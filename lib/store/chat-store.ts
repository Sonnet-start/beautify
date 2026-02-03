import { create } from "zustand";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface ConversationHistory {
    role: "user" | "assistant";
    content: string;
}

interface ChatState {
    messages: Message[];
    history: ConversationHistory[];
    isLoading: boolean;
    error: string | null;

    // Actions
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setHistory: (history: ConversationHistory[]) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    history: [],
    isLoading: false,
    error: null,

    addMessage: (message) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: `${Date.now()}-${Math.random()}`,
                    timestamp: new Date(),
                },
            ],
        })),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    setHistory: (history) => set({ history }),

    clearMessages: () => set({ messages: [], history: [], error: null }),
}));
