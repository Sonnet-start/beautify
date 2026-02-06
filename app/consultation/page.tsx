"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { AppNavbar } from "@/components/nav/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ConversationHistory, type Message, useChatStore } from "@/lib/store/chat-store";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageSquare, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatSession {
  id: string;
  title: string | null;
  created_at: string;
  chat_messages: { count: number }[];
}

export default function ConsultationPage() {
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    setError,
    setHistory,
    history,
    sessionId,
    setSessionId,
    setMessages,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = messages.length;
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [_isLoadingSessions, setIsLoadingSessions] = useState(true);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messageCount > 0) {
      scrollToBottom();
    }
  }, [messageCount, scrollToBottom]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setIsLoadingSessions(true);
      const response = await fetch("/api/chat/sessions");
      const data = await response.json();

      if (response.ok) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  }

  async function loadSession(sessionIdToLoad: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/sessions/${sessionIdToLoad}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки сессии");
      }

      interface DBMessage {
        id: string;
        role: "user" | "assistant";
        content: string;
        created_at: string;
      }

      // Convert DB messages to store format
      const loadedMessages: Message[] = data.messages.map((msg: DBMessage) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(loadedMessages);
      setSessionId(sessionIdToLoad);

      // Build history for context
      const conversationHistory: ConversationHistory[] = data.messages.map((msg: DBMessage) => ({
        role: msg.role,
        content: msg.content,
      }));
      setHistory(conversationHistory);
    } catch (err) {
      console.error("Failed to load session:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки сессии");
    } finally {
      setLoading(false);
    }
  }

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
          sessionId,
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

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Reload sessions to show new one
      loadSessions();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Произошла ошибка. Попробуйте еще раз.";

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
    <div className="min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <AppNavbar
        variant="page"
        title="ИИ‑Консультация"
        subtitle="Персональный косметолог"
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
                className="font-serif text-4xl mb-2 font-semibold"
              >
                Добро пожаловать!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8 max-w-md mx-auto"
              >
                Я ваш персональный ИИ‑косметолог. Задайте вопрос о уходе за кожей, и я дам
                персонализированные рекомендации.
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
                      className="rounded-full hover:bg-primary/20 hover:border-primary hover:text-primary transition-all hover:scale-105 dark:hover:bg-primary/10 dark:hover:border-primary/70"
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

      {/* History Sidebar */}
      {sessions.length > 0 && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-6 pb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                История консультаций
              </CardTitle>
              <CardDescription>Найдено записей: {sessions.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/50 transition-all group"
                    onClick={() => loadSession(session.id)}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {session.title || "Без названия"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.created_at).toLocaleString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          • {session.chat_messages[0]?.count || 0} сообщений
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
