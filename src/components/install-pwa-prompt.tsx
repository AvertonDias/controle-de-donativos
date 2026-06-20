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
      || (window.navigator as any).standalone;

    if (isStandalone) return;

    // Escutar o evento de instalação (Android/Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Evento beforeinstallprompt capturado com sucesso!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Mostrar modal após o login ser concluído
  useEffect(() => {
    if (!loading && user) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone;
      
      if (isStandalone) return;

      const timer = setTimeout(() => {
        if (deferredPrompt || isIos) {
          const wasDismissed = sessionStorage.getItem('pwa-modal-dismissed');
          if (!wasDismissed) {
            setIsOpen(true);
          }
        }
      }, 3000); // 3 segundos após o login

      return () => clearTimeout(timer);
    }
  }, [user, loading, deferredPrompt, isIos]);

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
          <DialogTitle className="flex items-center gap-3 text-primary font-headline text-2xl">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg shadow-primary/20 bg-white">
              <Image 
                src="/Ico.png" 
                alt="App Icon" 
                fill 
                sizes="48px"
                className="object-cover"
              />
            </div>
            Instalar Aplicativo
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-foreground/80">
            Tenha uma experiência melhor instalando o <strong>Controle de Donativos</strong> na sua tela de início.
          </DialogDescription>
        </DialogHeader>

        {isIos ? (
          <div className="space-y-4 py-4 text-sm text-muted-foreground border-y border-dashed my-2">
            <p className="font-semibold text-foreground">Instruções para iPhone:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>Toque no ícone de compartilhar <Share className="h-4 w-4 inline text-blue-500" />.</li>
              <li>Selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="h-4 w-4 inline" />.</li>
            </ol>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Download className="h-8 w-8 text-primary animate-bounce" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Isso instalará o aplicativo real no seu dispositivo.</p>
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