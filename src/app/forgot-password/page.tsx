
"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para resetar a senha.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o e-mail de recuperação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-lg shadow-primary/20">
              <Image 
                src="/Ico.png" 
                alt="Logo App" 
                fill 
                sizes="64px"
                className="object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">Recuperar Senha</CardTitle>
          <CardDescription>
            Enviaremos um link para o seu e-mail
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full py-6 font-bold" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Um link de recuperação foi enviado para <strong>{email}</strong>. 
                Por favor, verifique sua caixa de entrada e spam.
              </p>
              <Button variant="outline" onClick={() => setSent(false)} className="w-full">
                Tentar outro e-mail
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/login" className="flex items-center gap-2 text-sm text-primary hover:underline font-bold">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
