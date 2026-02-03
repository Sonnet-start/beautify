"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ImageUpload } from "./image-upload";

interface ChatInputProps {
    onSubmit: (message: string, image?: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSubmit,
    disabled = false,
    placeholder = "Задайте вопрос о уходе за кожей...",
}: ChatInputProps) {
    const [input, setInput] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | undefined>();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || disabled) return;

        onSubmit(input.trim() || "Проанализируй это фото", selectedImage);
        setInput("");
        setSelectedImage(undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <ImageUpload
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onRemove={() => setSelectedImage(undefined)}
            />

            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedImage ? "Добавьте описание (опционально)" : placeholder}
                className="flex-1 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors"
                disabled={disabled}
            />
            <Button
                type="submit"
                variant="gradient"
                size="icon"
                disabled={(!input.trim() && !selectedImage) || disabled}
                className="shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            >
                <Send className="h-5 w-5" />
            </Button>
        </form>
    );
}
