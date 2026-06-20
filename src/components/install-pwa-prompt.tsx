
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, PlusSquare } from "lucide-react";
import Image from "next/image";
import { useUser } from '@/firebase';

export function InstallPwaPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    // 1. Verificar se já está instalado (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return;

    // 2. Capturar evento de instalação no Android/Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Se o usuário acabou de logar e não está instalado, mostramos o modal
      if (!loading && user) {
        const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed-session');
        if (!isDismissed) {
          setTimeout(() => setIsOpen(true), 3000);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);

    if (ios && !loading && user) {
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed-session');
      if (!isDismissed) {
        setTimeout(() => setIsOpen(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [user, loading]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setIsOpen(false);
  };

  const dismissPrompt = () => {
    // Usamos sessionStorage para que o prompt volte em uma nova sessão se ele ainda não instalou
    sessionStorage.setItem('pwa-prompt-dismissed-session', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary font-headline text-2xl">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg shadow-primary/20">
              <Image 
                src="/Ico.png" 
                alt="App Icon" 
                fill 
                className="object-cover"
              />
            </div>
            Instalar Aplicativo
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-foreground/80">
            Adicione o <strong>Controle de Donativos</strong> à sua tela de início para um acesso rápido e experiência completa.
          </DialogDescription>
        </DialogHeader>

        {isIos ? (
          <div className="space-y-4 py-4 text-sm text-muted-foreground border-y border-dashed my-2">
            <p className="font-semibold text-foreground">Para instalar no seu iPhone:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li className="flex items-center gap-2 flex-wrap">
                Toque no ícone de compartilhar <Share className="h-5 w-5 inline text-blue-500" /> na barra do Safari.
              </li>
              <li className="flex items-center gap-2 flex-wrap">
                Role e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="h-5 w-5 inline" />.
              </li>
            </ol>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground italic">Instale agora para usar como um aplicativo nativo no seu celular.</p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isIos && deferredPrompt && (
            <Button onClick={handleInstallClick} className="w-full bg-primary hover:bg-accent py-6 text-lg font-bold shadow-md">
              Instalar Agora
            </Button>
          )}
          <Button variant="ghost" onClick={dismissPrompt} className="w-full text-muted-foreground hover:text-primary">
            Depois eu instalo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
