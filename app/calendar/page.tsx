"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import Link from "next/link";

interface RoutineItem {
    id: string;
    time: "morning" | "evening";
    name: string;
    done: boolean;
}

const defaultRoutine: RoutineItem[] = [
    { id: "1", time: "morning", name: "Очищение", done: false },
    { id: "2", time: "morning", name: "Тоник", done: false },
    { id: "3", time: "morning", name: "Сыворотка", done: false },
    { id: "4", time: "morning", name: "Увлажняющий крем", done: false },
    { id: "5", time: "morning", name: "SPF защита", done: false },
    { id: "6", time: "evening", name: "Очищение (двойное)", done: false },
    { id: "7", time: "evening", name: "Тоник", done: false },
    { id: "8", time: "evening", name: "Сыворотка/Активы", done: false },
    { id: "9", time: "evening", name: "Ночной крем", done: false },
];

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [routine, setRoutine] = useState<RoutineItem[]>(defaultRoutine);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    function prevMonth() {
        setCurrentDate(new Date(year, month - 1, 1));
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1));
    }

    function selectDay(day: number) {
        setSelectedDate(new Date(year, month, day));
    }

    function toggleRoutineItem(id: string) {
        setRoutine(prev =>
            prev.map(item =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        );
    }

    function isToday(day: number) {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    }

    function isSelected(day: number) {
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    }

    const morningRoutine = routine.filter(r => r.time === "morning");
    const eveningRoutine = routine.filter(r => r.time === "evening");

    return (
        <div className="min-h-screen bg-background">
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
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg">Календарь ухода</h1>
                            <p className="text-xs text-muted-foreground">Планируйте ежедневный уход</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Calendar */}
                    <Card glass>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <CardTitle className="font-serif">
                                    {months[month]} {year}
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Week days header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map(day => (
                                    <div
                                        key={day}
                                        className="text-center text-sm font-medium text-muted-foreground py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Empty cells for days before month starts */}
                                {Array.from({ length: startingDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {/* Days of the month */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => selectDay(day)}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors
                        ${isToday(day) ? "bg-primary text-primary-foreground" : ""}
                        ${isSelected(day) && !isToday(day) ? "bg-primary/20 text-primary" : ""}
                        ${!isToday(day) && !isSelected(day) ? "hover:bg-muted" : ""}
                      `}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily routine */}
                    <div className="space-y-6">
                        {/* Morning routine */}
                        <Card glass>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    ☀️ Утренний уход
                                </CardTitle>
                                <CardDescription>
                                    {selectedDate.toLocaleDateString("ru-RU", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long"
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {morningRoutine.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleRoutineItem(item.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                      ${item.done ? "bg-primary/10" : "hover:bg-muted"}`}
                                    >
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${item.done ? "bg-primary border-primary" : "border-muted-foreground"}`}
                                        >
                                            {item.done && <Check className="h-4 w-4 text-primary-foreground" />}
                                        </div>
                                        <span className={item.done ? "line-through text-muted-foreground" : ""}>
                                            {item.name}
                                        </span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Evening routine */}
                        <Card glass>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    🌙 Вечерний уход
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {eveningRoutine.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleRoutineItem(item.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                      ${item.done ? "bg-primary/10" : "hover:bg-muted"}`}
                                    >
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${item.done ? "bg-primary border-primary" : "border-muted-foreground"}`}
                                        >
                                            {item.done && <Check className="h-4 w-4 text-primary-foreground" />}
                                        </div>
                                        <span className={item.done ? "line-through text-muted-foreground" : ""}>
                                            {item.name}
                                        </span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Add custom step */}
                        <Button variant="outline" className="w-full" disabled>
                            <Plus className="mr-2 h-5 w-5" />
                            Добавить шаг (скоро)
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
