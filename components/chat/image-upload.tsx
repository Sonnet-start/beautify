"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Camera } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    onImageSelect: (base64: string) => void;
    onRemove: () => void;
    selectedImage?: string;
}

export function ImageUpload({ onImageSelect, onRemove, selectedImage }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Пожалуйста, выберите изображение");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Размер файла не должен превышать 5MB");
            return;
        }

        setIsProcessing(true);

        try {
            const base64 = await fileToBase64(file);
            onImageSelect(base64);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Ошибка при обработке изображения");
        } finally {
            setIsProcessing(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <AnimatePresence>
                {selectedImage ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative"
                    >
                        <Card className="p-2 relative overflow-hidden">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden">
                                <Image
                                    src={selectedImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={onRemove}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Card>
                    </motion.div>
                ) : (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="hover:bg-primary/10 transition-colors"
                    >
                        {isProcessing ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                            <Camera className="h-5 w-5" />
                        )}
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
}
