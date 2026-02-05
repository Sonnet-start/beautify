"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/nav/app-navbar";
import { Sparkles } from "lucide-react";
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

    async function handleSubmit(userMessage: string, image?: string) {
        addMessage({
            role: "user",
            content: userMessage,
            image,
        });

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    image,
                    history,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РѕС‚РІРµС‚Р°");
            }

            addMessage({
                role: "assistant",
                content: data.response,
            });

            setHistory(data.history);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР°. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰Рµ СЂР°Р·.";

            setError(errorMessage);
            addMessage({
                role: "assistant",
                content: `вќЊ ${errorMessage}`,
            });
        } finally {
            setLoading(false);
        }
    }

    const suggestedQuestions = [
        "РљР°Рє СѓС…Р°Р¶РёРІР°С‚СЊ Р·Р° РєРѕРјР±РёРЅРёСЂРѕРІР°РЅРЅРѕР№ РєРѕР¶РµР№?",
        "РљР°РєРѕР№ РїРѕСЂСЏРґРѕРє РЅР°РЅРµСЃРµРЅРёСЏ СЃСЂРµРґСЃС‚РІ?",
        "РљР°Рє Р±РѕСЂРѕС‚СЊСЃСЏ СЃ СЂР°СЃС€РёСЂРµРЅРЅС‹РјРё РїРѕСЂР°РјРё?",
        "Р РµРєРѕРјРµРЅРґР°С†РёРё РґР»СЏ РєРѕР¶Рё РїРѕСЃР»Рµ 30",
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
            <AppNavbar
                variant="page"
                title="AI-РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ"
                subtitle="РџРµСЂСЃРѕРЅР°Р»СЊРЅС‹Р№ РєРѕСЃРјРµС‚РѕР»РѕРі"
                icon={<Sparkles className="h-5 w-5 text-primary" />}
                backHref="/dashboard"
                containerClassName="max-w-3xl"
            />

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
                                Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground mb-8 max-w-md mx-auto"
                            >
                                РЇ РІР°С€ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹Р№ AI-РєРѕСЃРјРµС‚РѕР»РѕРі. Р—Р°РґР°Р№С‚Рµ РІРѕРїСЂРѕСЃ Рѕ СѓС…РѕРґРµ Р·Р° РєРѕР¶РµР№,
                                Рё СЏ РґР°Рј РїРµСЂСЃРѕРЅР°Р»РёР·РёСЂРѕРІР°РЅРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё.
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

