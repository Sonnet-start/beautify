"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { login, signInWithGitHub, signInWithGoogle } from "../actions";

// GitHub icon component
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img">
      <title>GitHub</title>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Google">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.2-1.44 3.6-5.4 3.6-3.24 0-5.88-2.7-5.88-6s2.64-6 5.88-6c1.86 0 3.1.78 3.8 1.44l2.58-2.46C16.8 3 14.64 2 12 2 6.96 2 2.88 6.04 2.88 11s4.08 9 9.12 9c5.28 0 8.76-3.72 8.76-8.94 0-.6-.06-1.02-.12-1.44H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.2l3.18 2.34C7.92 7.5 9.78 6 12 6c1.86 0 3.1.78 3.8 1.44l2.58-2.46C16.8 3 14.64 2 12 2 8.34 2 5.16 4.14 3.9 7.2z"
      />
      <path
        fill="#4A90E2"
        d="M12 20c2.64 0 4.8-.84 6.4-2.28l-3.12-2.52c-.84.6-1.98 1.02-3.28 1.02-2.28 0-4.2-1.5-4.92-3.6l-3.24 2.52C5.04 18.06 8.34 20 12 20z"
      />
      <path
        fill="#FBBC05"
        d="M6.96 12.6A5.9 5.9 0 0 1 6.6 11c0-.54.12-1.08.3-1.56L3.72 7.2A8.96 8.96 0 0 0 3 11c0 1.5.36 2.94 1.02 4.2l2.94-2.6z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  async function handleGitHubLogin() {
    setIsGitHubLoading(true);
    setError(null);

    const result = await signInWithGitHub();

    if (result?.error) {
      setError(result.error);
      setIsGitHubLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setError(null);

    const result = await signInWithGoogle();

    if (result?.error) {
      setError(result.error);
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card glass className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="font-serif text-4xl">Добро пожаловать</CardTitle>
              <CardDescription className="text-base mt-2">
                Войдите, чтобы продолжить
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <GoogleIcon className="mr-2 h-5 w-5" />
                {isGoogleLoading ? "Перенаправление..." : "Войти через Google"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGitHubLogin}
                disabled={isGitHubLoading}
              >
                <GitHubIcon className="mr-2 h-5 w-5" />
                {isGitHubLoading ? "Перенаправление..." : "Войти через GitHub"}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">или</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                className="w-full glow"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти с Email"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
