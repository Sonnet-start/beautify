import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string; // base64 encoded image
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
  sessionId: string | null;

  // Actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHistory: (history: ConversationHistory[]) => void;
  setSessionId: (sessionId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  history: [],
  isLoading: false,
  error: null,
  sessionId: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setHistory: (history) => set({ history }),

  setSessionId: (sessionId) => set({ sessionId }),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [], history: [], error: null, sessionId: null }),
}));
