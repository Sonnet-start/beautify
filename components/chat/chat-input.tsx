"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSubmit,
    disabled = false,
    placeholder = "Задайте вопрос о уходе за кожей...",
}: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        onSubmit(input.trim());
        setInput("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors"
                disabled={disabled}
            />
            <Button
                type="submit"
                variant="gradient"
                size="icon"
                disabled={!input.trim() || disabled}
                className="shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            >
                <Send className="h-5 w-5" />
            </Button>
        </form>
    );
}
