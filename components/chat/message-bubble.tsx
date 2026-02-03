"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { Message } from "@/lib/store/chat-store";

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
        >
            {!isUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
            )}

            <Card
                glass={!isUser}
                className={`max-w-[80%] p-4 ${isUser
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    : "shadow-md"
                    }`}
            >
                {message.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                        <Image
                            src={message.image}
                            alt="Uploaded image"
                            width={300}
                            height={300}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                </div>
            </Card>

            {isUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                    <User className="h-4 w-4 text-primary-foreground" />
                </div>
            )}
        </motion.div>
    );
}

export function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3"
        >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <Card glass className="p-4 shadow-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Анализирую...</span>
                </div>
            </Card>
        </motion.div>
    );
}
