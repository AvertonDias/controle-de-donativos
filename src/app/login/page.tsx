"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Chrome } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: "E-mail ou senha incorretos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro com Google",
        description: "Não foi possível entrar com sua conta Google.",
      });
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
                priority
                className="object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">Bem-vindo</CardTitle>
          <CardDescription>
            Acesse o sistema de Controle de Donativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="username email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full py-6 font-bold" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full py-6 font-medium gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={handleGoogleLogin}
          >
            <Chrome className="h-5 w-5" />
            Entrar com Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Cadastre-se agora
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}