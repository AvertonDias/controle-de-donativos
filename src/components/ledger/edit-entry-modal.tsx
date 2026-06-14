"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LedgerEntry } from '@/lib/ledger-store';

interface EditEntryModalProps {
  entry: LedgerEntry | null;
  onClose: () => void;
  onUpdate: (id: string, originalDate: string, entry: Omit<LedgerEntry, 'id' | 'dailySum' | 'createdAt'>) => void;
}

export function EditEntryModal({ entry, onClose, onUpdate }: EditEntryModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    worldwideWork: '',
    congregation: '',
    observations: '',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        worldwideWork: entry.worldwideWork.toString(),
        congregation: entry.congregation.toString(),
        observations: entry.observations || '',
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    onUpdate(entry.id, entry.date, {
      date: formData.date,
      worldwideWork: parseFloat(formData.worldwideWork) || 0,
      congregation: parseFloat(formData.congregation) || 0,
      observations: formData.observations,
    });
    onClose();
  };

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Editar Registro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-worldwide" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Obra Mundial</Label>
                <Input
                  id="edit-worldwide"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.worldwideWork}
                  onChange={(e) => setFormData({ ...formData, worldwideWork: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-congregation" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Congregação</Label>
                <Input
                  id="edit-congregation"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.congregation}
                  onChange={(e) => setFormData({ ...formData, congregation: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-observations" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Observações</Label>
              <Textarea
                id="edit-observations"
                placeholder="Notas sobre este registro"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-accent font-semibold py-6">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}