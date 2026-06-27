"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useUserSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings, Menu, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

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
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);

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

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId) 
        : [...prev, dayId].sort()
    );
  };

  const handleSave = () => {
    updateSettings({ meetingDays: selectedDays });
    toast({
      title: "Configurações salvas!",
      description: "Os dias de reunião foram atualizados com sucesso.",
    });
    router.push("/");
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
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-primary hover:bg-primary/5">
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
          <Button onClick={handleSave} className="gap-2 bg-primary font-bold">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <Card>
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
                <div key={day.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toggleDay(day.id)}>
                  <Checkbox 
                    id={`day-${day.id}`} 
                    checked={selectedDays.includes(day.id)} 
                    onCheckedChange={() => toggleDay(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`} className="flex-1 cursor-pointer font-medium">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
