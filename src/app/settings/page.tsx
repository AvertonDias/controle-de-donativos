
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useUserSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Menu, Calendar, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DAYS_OF_WEEK = [
  { id: 0, label: "Domingo" },
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings(user?.uid);
  const { isMobile, openMobile, open, toggleSidebar } = useSidebar();
  const { toast } = useToast();
  
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  const isSidebarOpen = isMobile ? openMobile : open;

  // Sincroniza dados iniciais
  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  React.useEffect(() => {
    if (settings) {
      setSelectedDays(settings.meetingDays);
    }
  }, [settings]);

  // Detecta se houve mudanças comparando os arrays ordenados
  const hasChanges = React.useMemo(() => {
    const sortedCurrent = [...selectedDays].sort((a, b) => a - b);
    const sortedSaved = [...(settings?.meetingDays || [])].sort((a, b) => a - b);
    return JSON.stringify(sortedCurrent) !== JSON.stringify(sortedSaved);
  }, [selectedDays, settings]);

  // Sincroniza estado dirty com a flag global para a Sidebar
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__SETTINGS_DIRTY__ = hasChanges;
    }
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).__SETTINGS_DIRTY__ = false;
      }
    };
  }, [hasChanges]);

  // Trava de fechamento de aba/refresh do navegador
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId) 
        : [...prev, dayId].sort()
    );
  };

  const handleSave = () => {
    updateSettings({ meetingDays: selectedDays });
    if (typeof window !== 'undefined') {
      (window as any).__SETTINGS_DIRTY__ = false;
    }
    toast({
      title: "Configurações salvas!",
      description: "Os dias de reunião foram atualizados com sucesso.",
    });
    router.push("/");
  };

  const handleToggleAttempt = (e: React.MouseEvent) => {
    // Se o menu já estiver aberto, permite fechar normalmente
    if (isSidebarOpen) {
      toggleSidebar();
      return;
    }

    // Se houver mudanças, bloqueia a abertura do menu e mostra o alerta
    if (hasChanges) {
      e.preventDefault();
      e.stopPropagation();
      setShowExitConfirm(true);
    } else {
      toggleSidebar();
    }
  };

  if (userLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-headline text-xl">carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-[60] shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger 
              onClick={handleToggleAttempt}
              className="text-primary hover:bg-primary/5"
            >
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image 
                  src="/Ico.png" 
                  alt="Logo" 
                  fill 
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-tight">
                Configurações
              </h1>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            className={`gap-2 font-bold transition-all ${hasChanges ? 'bg-primary shadow-lg scale-105' : 'bg-muted text-muted-foreground'}`}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-24">
        <div className="mt-8">
          {hasChanges && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Você tem alterações não salvas. Clique em "Salvar Alterações" antes de sair.</p>
            </div>
          )}

          <Card className={hasChanges ? "border-amber-200 shadow-md" : ""}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <Calendar className="h-6 w-6" /> Dias de Reunião
              </CardTitle>
              <CardDescription>
                Selecione os dias da semana em que sua congregação realiza reuniões. O sistema usará isso para auditar se há lançamentos nestes dias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div 
                    key={day.id} 
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${selectedDays.includes(day.id) ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'hover:bg-muted/30'}`} 
                    onClick={() => toggleDay(day.id)}
                  >
                    <Checkbox 
                      id={`day-${day.id}`} 
                      checked={selectedDays.includes(day.id)} 
                      onCheckedChange={() => toggleDay(day.id)}
                      className="h-5 w-5 pointer-events-none"
                    />
                    <Label 
                      htmlFor={`day-${day.id}`} 
                      className="flex-1 cursor-pointer font-bold text-base"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alterações não salvas
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você fez alterações nos dias de reunião que ainda não foram salvas. Se sair agora, essas mudanças serão perdidas. Deseja realmente sair?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Permanecer e Salvar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  (window as any).__SETTINGS_DIRTY__ = false;
                }
                setShowExitConfirm(false);
                router.push("/");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
