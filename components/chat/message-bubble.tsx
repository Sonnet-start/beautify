"use client";

import { Card } from "@/components/ui/card";
import type { Message } from "@/lib/store/chat-store";
import { motion } from "framer-motion";
import { Loader2, Sparkles, User } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        className={`max-w-[80%] p-4 ${
          isUser
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
        <ReactMarkdown
          className="markdown text-base leading-relaxed"
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold tracking-tight">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-semibold tracking-tight">{children}</h3>,
            p: ({ children }) => <p className="leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            hr: () => <hr className="border-border/60" />,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{children}</pre>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
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
          <span className="text-base">Анализирую...</span>
        </div>
      </Card>
    </motion.div>
  );
}

