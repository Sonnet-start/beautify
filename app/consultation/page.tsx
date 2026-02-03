"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Sparkles, User, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ConversationHistory {
    role: "user" | "assistant";
    content: string;
}

export default function ConsultationPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<ConversationHistory[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ошибка при получении ответа");
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setHistory(data.history);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: error instanceof Error
                    ? error.message
                    : "Произошла ошибка. Попробуйте еще раз.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg">AI-Консультация</h1>
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
                            className="text-center py-12"
                        >
                            <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="font-serif text-2xl mb-2">Добро пожаловать!</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Я ваш персональный AI-косметолог. Задайте вопрос о уходе за кожей,
                                и я дам персонализированные рекомендации.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestedQuestions.map((question) => (
                                    <Button
                                        key={question}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setInput(question)}
                                    >
                                        {question}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Sparkles className="h-4 w-4 text-primary" />
                                            </div>
                                        )}

                                        <Card
                                            glass={message.role === "assistant"}
                                            className={`max-w-[80%] p-4 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : ""
                                                }`}
                                        >
                                            <div className="whitespace-pre-wrap text-sm">
                                                {message.content}
                                            </div>
                                        </Card>

                                        {message.role === "user" && (
                                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                <User className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    </div>
                                    <Card glass className="p-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">Анализирую...</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Input */}
            <div className="border-t border-border/50 backdrop-blur-sm bg-background/80 sticky bottom-0">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Задайте вопрос о уходе за кожей..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            variant="gradient"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="shrink-0"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
