"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ isOpen, onAccept }: DisclaimerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden p-8"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

          <DialogHeader className="relative z-10 text-center space-y-4 pb-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Юридическая ответственность
            </DialogTitle>
          </DialogHeader>

          <div className="relative z-10 space-y-4 py-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground/90">
              Данный сервис носит исключительно информационный характер и не является медицинской
              консультацией.
            </p>
            <p>
              Рекомендации формируются с использованием искусственного интеллекта и не заменяют
              очный приём у врача-дерматолога или косметолога.
            </p>
            <p>
              Пользователь самостоятельно несёт ответственность за достоверность предоставленных
              данных о состоянии кожи и наличии аллергических реакций.
            </p>
            <p>
              Перед использованием любых косметических или уходовых средств рекомендуется получить
              консультацию квалифицированного специалиста.
            </p>
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 font-medium">
                В случае появления выраженных воспалений, боли, ухудшения состояния кожи или иных
                тревожных симптомов необходимо обратиться к врачу.
              </p>
            </div>
          </div>

          <DialogFooter className="relative z-10 pt-6">
            <Button
              onClick={onAccept}
              variant="gradient"
              size="lg"
              className="w-full rounded-2xl h-12 text-base font-semibold glow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Я ознакомился(ась) и принимаю условия
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
