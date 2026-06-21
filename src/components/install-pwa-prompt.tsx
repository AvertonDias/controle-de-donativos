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
import { Share, PlusSquare, Download } from "lucide-react";
import Image from "next/image";
import { useUser } from '@/firebase';

export function InstallPwaPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    // Detectar se já é standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Escutar o evento de instalação (Android/Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Mostrar modal após o login
  useEffect(() => {
    if (!loading && user) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone === true;
      
      if (isStandalone) return;

      const timer = setTimeout(() => {
        const wasDismissed = sessionStorage.getItem('pwa-modal-dismissed');
        if (!wasDismissed) {
          setIsOpen(true);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsOpen(false);
    }
  };

  const dismissPrompt = () => {
    sessionStorage.setItem('pwa-modal-dismissed', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl shadow-lg border-2 border-primary/10 bg-white">
              <Image 
                src="/Ico.png" 
                alt="App Icon" 
                fill 
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-primary font-headline text-2xl">
                Instalar App
              </DialogTitle>
              <DialogDescription className="text-sm font-medium">
                Controle de Donativos
              </DialogDescription>
            </div>
          </div>
          <p className="pt-2 text-base text-foreground/80 leading-relaxed">
            Tenha uma experiência muito melhor instalando o aplicativo oficial na sua tela de início.
          </p>
        </DialogHeader>

        {isIos ? (
          <div className="space-y-4 py-4 text-sm text-muted-foreground border-y border-dashed my-2">
            <p className="font-semibold text-foreground">Instruções para iPhone:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>Toque no ícone de compartilhar <Share className="h-4 w-4 inline text-blue-500 mx-1" />.</li>
              <li>Role e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="h-4 w-4 inline mx-1" />.</li>
            </ol>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4 bg-muted/30 rounded-lg my-2">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Download className="h-8 w-8 text-primary animate-bounce" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              Isso criará o aplicativo real no seu dispositivo, com acesso rápido e tela cheia.
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          {!isIos && (
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