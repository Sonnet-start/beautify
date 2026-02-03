"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useChatStore } from "@/lib/store/chat-store";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";

export default function ConsultationPage() {
    const { messages, isLoading, addMessage, setLoading, setError, setHistory, history } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function handleSubmit(userMessage: string) {
        addMessage({
            role: "user",
            content: userMessage,
        });

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ошибка при получении ответа");
            }

            addMessage({
                role: "assistant",
                content: data.response,
            });

            setHistory(data.history);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Произошла ошибка. Попробуйте еще раз.";

            setError(errorMessage);
            addMessage({
                role: "assistant",
                content: `❌ ${errorMessage}`,
            });
        } finally {
            setLoading(false);
        }
    }

    const suggestedQuestions = [
        "Как ухаживать за комбинированной кожей?",
        "Какой порядок нанесения средств?",
        "Как бороться с расширенными порами?",
        "Рекомендации для кожи после 30",
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-40 shadow-sm">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg font-semibold">AI-Консультация</h1>
                            <p className="text-xs text-muted-foreground">Персональный косметолог</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-6">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-lg"
                            >
                                <Sparkles className="h-10 w-10 text-primary" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="font-serif text-2xl mb-2 font-semibold"
                            >
                                Добро пожаловать!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground mb-8 max-w-md mx-auto"
                            >
                                Я ваш персональный AI-косметолог. Задайте вопрос о уходе за кожей,
                                и я дам персонализированные рекомендации.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap justify-center gap-2"
                            >
                                {suggestedQuestions.map((question, i) => (
                                    <motion.div
                                        key={question}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105"
                                            onClick={() => handleSubmit(question)}
                                        >
                                            {question}
                                        </Button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {messages.map((message, index) => (
                                    <MessageBubble key={message.id} message={message} index={index} />
                                ))}
                            </AnimatePresence>

                            {isLoading && <TypingIndicator />}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Input */}
            <div className="border-t border-border/50 backdrop-blur-md bg-background/80 sticky bottom-0 shadow-lg">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
                </div>
            </div>
        </div>
    );
}
