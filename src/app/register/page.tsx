"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível criar sua conta.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error: any) {
      let errorMessage = "Não foi possível cadastrar com sua conta Google.";
      
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "O login com Google não está ativado no Firebase Console.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Este domínio não está autorizado no Firebase Console.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "O popup foi bloqueado pelo seu navegador.";
      }

      toast({
        variant: "destructive",
        title: "Erro com Google",
        description: errorMessage,
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
                className="object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para gerenciar os donativos da congregação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                placeholder="João Silva" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                autoComplete="name"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-[10px] text-muted-foreground">Mínimo de 6 caracteres</p>
            </div>
            <Button type="submit" className="w-full py-6 font-bold" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full py-6 font-medium gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary focus:text-primary transition-colors"
            onClick={handleGoogleRegister}
          >
            <Chrome className="h-5 w-5 text-primary" />
            Cadastrar com Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}