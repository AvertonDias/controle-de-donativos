"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface AddEntryModalProps {
  onAdd: (entry: { date: string; worldwideWork: number; congregation: number; observations: string }) => void;
}

export function AddEntryModal({ onAdd }: AddEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    worldwideWork: '',
    congregation: '',
    observations: '',
  });

  // Define a data padrão como "hoje" no fuso de Brasília ao montar o componente
  useEffect(() => {
    const getBrasiliaDate = () => {
      const now = new Date();
      return new Intl.DateTimeFormat('fr-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(now);
    };
    
    if (open) {
      setFormData(prev => ({ ...prev, date: getBrasiliaDate() }));
    }
  }, [open]); // Atualiza sempre que o modal abre para garantir que a data esteja correta se passar da meia-noite

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: formData.date,
      worldwideWork: parseFloat(formData.worldwideWork) || 0,
      congregation: parseFloat(formData.congregation) || 0,
      observations: formData.observations,
    });
    
    // Resetar campos mantendo a data de hoje
    const now = new Date();
    const today = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);

    setFormData({
      date: today,
      worldwideWork: '',
      congregation: '',
      observations: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full h-14 w-14 shadow-lg fixed bottom-8 right-8 bg-primary hover:bg-accent transition-all">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Nova Contribuição</DialogTitle>
            <DialogDescription className="sr-only">
              Preencha os valores para a obra mundial e congregação para registrar o donativo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="worldwide" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Obra Mundial</Label>
                <Input
                  id="worldwide"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.worldwideWork}
                  onChange={(e) => setFormData({ ...formData, worldwideWork: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="congregation" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Congregação</Label>
                <Input
                  id="congregation"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.congregation}
                  onChange={(e) => setFormData({ ...formData, congregation: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Observações</Label>
              <Textarea
                id="observations"
                placeholder="Ex: Refere-se à reunião de quinta-feira passada"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-accent font-semibold py-6">
              Adicionar Registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
