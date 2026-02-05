"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Heart,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function DesignDemoPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const features = [
    {
      icon: Camera,
      title: "ИИ-анализ фото",
      description: "Загрузите фото кожи для детального анализа",
    },
    {
      icon: MessageCircle,
      title: "Чат с косметологом",
      description: "Получите персональные рекомендации 24/7",
    },
    {
      icon: Calendar,
      title: "Календарь ухода",
      description: "Планируйте процедуры и не пропускайте их",
    },
    {
      icon: TrendingUp,
      title: "Отслеживание прогресса",
      description: "Следите за улучшениями кожи",
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="glass" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            ИИ-косметология
          </motion.div>

          <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground">
            Мой личный <span className="gradient-text">косметолог</span>
          </h1>

          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Получите персонализированные рекомендации по уходу за кожей от искусственного
            интеллекта. Профессиональный уход доступен каждому.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" variant="gradient" className="glow">
              <Heart className="mr-2 h-5 w-5" />
              Начать бесплатно
            </Button>
            <Button size="xl" variant="outline">
              Узнать больше
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Typography Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-serif text-3xl text-foreground">Типографика</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <Card glass>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Tenor Sans</CardTitle>
              <CardDescription>Акцентный шрифт для заголовков</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-4xl">Красота начинается</p>
              <p className="font-serif text-2xl text-muted-foreground">с правильного ухода</p>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle className="text-lg">Noto Sans</CardTitle>
              <CardDescription>Основной шрифт для текста</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg font-semibold">Полужирный текст (600)</p>
              <p className="text-base">
                Обычный текст для основного контента. Кириллица полностью поддерживается.
              </p>
              <p className="text-sm text-muted-foreground">
                Мелкий текст для подписей и примечаний
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Colors Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-serif text-3xl text-foreground">Цветовая палитра</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-primary shadow-lg" />
            <p className="text-sm font-medium">Primary (Pink)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-accent shadow-lg" />
            <p className="text-sm font-medium">Accent (Peach)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-secondary shadow-lg" />
            <p className="text-sm font-medium">Secondary (Blue)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-muted shadow-lg" />
            <p className="text-sm font-medium">Muted</p>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-serif text-3xl text-foreground">Кнопки</h2>

        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-serif text-3xl text-foreground">Карточки и Glassmorphism</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Glow Effect Demo */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-serif text-3xl text-foreground">Эффект свечения (Glow)</h2>

        <div className="flex flex-wrap items-center gap-8">
          <Card className="glow p-8">
            <p className="text-lg font-medium">Карточка с эффектом Glow</p>
          </Card>

          <Button size="xl" variant="gradient" className="glow">
            Кнопка с Glow
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Демонстрация дизайн-системы • Мой личный косметолог</p>
      </footer>
    </div>
  );
}
