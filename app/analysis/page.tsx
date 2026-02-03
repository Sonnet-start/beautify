"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload, Loader2, Sparkles, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AnalysisPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setError("Поддерживаются только JPEG, PNG и WebP");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("Максимальный размер файла: 10 МБ");
            return;
        }

        setError(null);
        setSelectedFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setAnalysis(null);
    }

    function clearImage() {
        setSelectedImage(null);
        setSelectedFile(null);
        setAnalysis(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleAnalyze() {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ошибка при анализе");
            }

            setAnalysis(data.analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Произошла ошибка");
        } finally {
            setIsAnalyzing(false);
        }
    }

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
                            <Camera className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg">Анализ фото</h1>
                            <p className="text-xs text-muted-foreground">AI-диагностика кожи</p>
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
                    {/* Upload area */}
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Загрузите фото</CardTitle>
                            <CardDescription>
                                Сделайте фото лица при хорошем освещении для точного анализа
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <AnimatePresence mode="wait">
                                {!selectedImage ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                    >
                                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="text-lg font-medium mb-1">Нажмите для загрузки</p>
                                        <p className="text-sm text-muted-foreground">
                                            JPEG, PNG или WebP до 10 МБ
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative"
                                    >
                                        <div className="relative aspect-square max-w-sm mx-auto rounded-xl overflow-hidden bg-muted">
                                            <Image
                                                src={selectedImage}
                                                alt="Загруженное фото"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={clearImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 text-sm text-destructive text-center"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {selectedImage && !analysis && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6"
                                >
                                    <Button
                                        onClick={handleAnalyze}
                                        variant="gradient"
                                        size="lg"
                                        className="w-full glow"
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Анализируем...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Проанализировать
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Analysis result */}
                    <AnimatePresence>
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card glass>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle>Результат анализа</CardTitle>
                                                <CardDescription>AI-рекомендации на основе фото</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <div className="whitespace-pre-wrap">{analysis}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tips */}
                    {!selectedImage && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Советы для лучшего результата
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Используйте естественное освещение</li>
                                    <li>• Снимайте без макияжа</li>
                                    <li>• Держите камеру на расстоянии 30-40 см</li>
                                    <li>• Убедитесь, что лицо полностью в кадре</li>
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
