
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, PlusSquare, Download } from "lucide-react";
import Image from "next/image";
import { useUser } from '@/firebase';

export function InstallPwaPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // Detecta se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA: Evento beforeinstallprompt capturado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Abre o modal após o login
  useEffect(() => {
    if (user) {
      const wasDismissed = sessionStorage.getItem('pwa-modal-dismissed');
      if (!wasDismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: Prompt de instalação ainda não disponível');
      alert("O navegador ainda está validando o aplicativo. Por favor, aguarde alguns segundos e tente novamente.");
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA: Usuário aceitou a instalação');
      setDeferredPrompt(null);
      setIsOpen(false);
    } else {
      console.log('PWA: Usuário recusou a instalação');
    }
  };

  const dismissPrompt = () => {
    sessionStorage.setItem('pwa-modal-dismissed', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] border-primary/20 p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Instalar Controle de Donativos</DialogTitle>
          <DialogDescription>
            Instale o aplicativo oficial para ter acesso rápido e uma experiência nativa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-primary p-8 flex flex-col items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20 mb-4 bg-white p-2">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image 
                src="/Ico.png" 
                alt="App Icon" 
                fill 
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>
          <h2 className="text-2xl font-headline font-bold mb-1">Instalar App Real</h2>
          <p className="text-white/80 text-center text-sm font-medium">Controle de Donativos</p>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed text-center">
            Obtenha a melhor experiência instalando o aplicativo oficial diretamente no seu dispositivo.
          </p>

          {isIos ? (
            <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="font-bold text-xs text-blue-800 uppercase tracking-widest">Instruções para iOS:</p>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Share className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-blue-700">1. Toque no ícone de compartilhar na barra inferior do Safari.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <PlusSquare className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-blue-700">2. Escolha &quot;Adicionar à Tela de Início&quot;.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                onClick={handleInstallClick} 
                className="w-full bg-primary hover:bg-accent py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Download className="mr-2 h-5 w-5" />
                Instalar Agora
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                Rápido • Seguro • Gratuito
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button 
              onClick={dismissPrompt} 
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Depois eu instalo
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
