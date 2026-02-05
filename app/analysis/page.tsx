"use client";

import { AppNavbar } from "@/components/nav/app-navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Clock, Image as ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisHistory {
  id: string;
  image_path: string | null;
  imageUrl: string | null;
  analysis_text: string;
  created_at: string;
}

export default function AnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [_isLoadingHistory, setIsLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageFile(file);
  }

  const handleImageFile = useCallback((file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Поддерживаются форматы JPEG, PNG и WebP");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Максимальный размер файла: 10 МБ");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setAnalysis(null);
  }, []);

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
    if (!imageItem) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    e.preventDefault();
    handleImageFile(file);
  }

  useEffect(() => {
    function handleWindowPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;

      const file = imageItem.getAsFile();
      if (!file) return;

      e.preventDefault();
      handleImageFile(file);
    }

    window.addEventListener("paste", handleWindowPaste);
    return () => {
      window.removeEventListener("paste", handleWindowPaste);
    };
  }, [handleImageFile]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setIsLoadingHistory(true);
      const response = await fetch("/api/analyze/history");
      const data = await response.json();

      if (response.ok) {
        setHistory(data.analyses || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
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
      // Reload history to show new analysis
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
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
      <AppNavbar
        variant="page"
        title="Анализ кожи"
        subtitle="ИИ-анализ состояния кожи"
        icon={<Camera className="h-5 w-5 text-primary" />}
        backHref="/dashboard"
        containerClassName="max-w-3xl"
      />

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Upload area */}
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Загрузите фото</CardTitle>
                <CardDescription>Сделайте фото лица для анализа состояния кожи</CardDescription>
              </div>
              {selectedImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all shadow-lg"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent onPaste={handlePaste}>
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
                    <p className="text-sm text-muted-foreground">JPEG, PNG или WebP до 10 МБ</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Можно вставить изображение из буфера обмена (Ctrl+V)
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
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
                        <CardTitle className="text-lg">Результаты анализа</CardTitle>
                        <CardDescription>ИИ-рекомендации по уходу за кожей</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ReactMarkdown
                      className="markdown text-base leading-relaxed"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold tracking-tight">{children}</h3>
                        ),
                        p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        hr: () => <hr className="border-border/60" />,
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => <em className="italic">{children}</em>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {analysis}
                    </ReactMarkdown>
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
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>Используйте хорошее освещение</li>
                  <li>Снимайте без макияжа</li>
                  <li>Держите камеру на расстоянии 30-40 см</li>
                  <li>Убедитесь, что лицо в фокусе и по центру</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  История
                </CardTitle>
                <CardDescription>Найдено записей: {history.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {history.map((item, index) => (
                    <AccordionItem key={item.id} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex gap-4 items-center w-full pr-4">
                          {item.imageUrl && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                              <Image
                                src={item.imageUrl}
                                alt="Анализ"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm text-muted-foreground mb-1">
                              {new Date(item.created_at).toLocaleString("ru-RU", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-sm line-clamp-2">{item.analysis_text}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 pl-20">
                          <ReactMarkdown
                            className="markdown text-sm leading-relaxed"
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-xl font-semibold tracking-tight mb-3">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-lg font-semibold tracking-tight mb-2">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-base font-semibold tracking-tight mb-2">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="leading-relaxed mb-3">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>
                              ),
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              hr: () => <hr className="border-border/60 my-3" />,
                              strong: ({ children }) => (
                                <strong className="font-semibold">{children}</strong>
                              ),
                              em: ({ children }) => <em className="italic">{children}</em>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground mb-3">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {item.analysis_text}
                          </ReactMarkdown>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
