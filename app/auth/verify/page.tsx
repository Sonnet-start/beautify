import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <Card glass className="max-w-md border-0 shadow-2xl text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Проверьте вашу почту</CardTitle>
          <CardDescription className="text-base">
            Мы отправили письмо с ссылкой для подтверждения на ваш email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Не получили письмо? Проверьте папку &quot;Спам&quot; или попробуйте зарегистрироваться
            снова.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
