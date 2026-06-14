
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddEntryModalProps {
  onAdd: (entry: { date: string; worldwideWork: number; congregation: number }) => void;
}

export function AddEntryModal({ onAdd }: AddEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    worldwideWork: '',
    congregation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: formData.date,
      worldwideWork: parseFloat(formData.worldwideWork) || 0,
      congregation: parseFloat(formData.congregation) || 0,
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      worldwideWork: '',
      congregation: '',
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
            <div className="space-y-2">
              <Label htmlFor="worldwide" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Obra Mundial (OMTJ)</Label>
              <Input
                id="worldwide"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.worldwideWork}
                onChange={(e) => setFormData({ ...formData, worldwideWork: e.target.value })}
                required
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
                required
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
