
"use client";

import React, { useState } from 'react';
import { LedgerEntry } from '@/lib/ledger-store';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format,
  isSameDay,
  parseISO,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, CalendarDays, MessageSquare, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MonthlyAuditProps {
  entries: LedgerEntry[];
  selectedMonth: Date;
  meetingDays: number[];
  onAddJustification: (entry: { date: string; worldwideWork: number; congregation: number; observations: string }) => void;
}

export function MonthlyAudit({ entries, selectedMonth, meetingDays, onAddJustification }: MonthlyAuditProps) {
  const [justifyingDate, setJustifyingDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  // Filtramos os dias do mês baseados nos dias de reunião configurados
  const expectedDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
    .filter(date => meetingDays.includes(getDay(date)));

  const missingDates = expectedDates.filter(expectedDate => {
    return !entries.find(entry => isSameDay(parseISO(entry.date), expectedDate));
  });

  const entriesWithObservations = entries.filter(e => e.observations && e.observations.trim() !== '');

  const allRecorded = missingDates.length === 0;

  const handleSaveJustification = () => {
    if (justifyingDate && reason) {
      onAddJustification({
        date: format(justifyingDate, "yyyy-MM-dd"),
        worldwideWork: 0,
        congregation: 0,
        observations: reason
      });
      setJustifyingDate(null);
      setReason("");
    }
  };

  const getDayNames = () => {
    const names = [
      "Domingos", "Segundas", "Terças", "Quartas", "Quintas", "Sextas", "Sábados"
    ];
    return meetingDays.map(d => names[d]).join(" e ");
  };

  return (
    <>
      <Card className={`mb-8 border-l-4 ${allRecorded ? 'border-l-green-500' : 'border-l-amber-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            Conferência de Registros ({meetingDays.length > 0 ? getDayNames() : "Nenhum dia configurado"})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {meetingDays.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Vá em configurações para definir os dias de reunião.</p>
          ) : allRecorded ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Todos os dias esperados deste mês possuem um registro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Existem dias de reunião sem lançamentos:</p>
                  <p className="text-xs opacity-80 mt-1">
                    Clique na data para adicionar uma justificativa ou lançamento.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {missingDates.map((date, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="bg-white hover:bg-amber-100 cursor-pointer text-amber-700 border-amber-200 capitalize py-1 px-2 transition-colors flex items-center gap-2"
                    onClick={() => setJustifyingDate(date)}
                  >
                    {format(date, "dd/MM eeee", { locale: ptBR })}
                    <PlusCircle className="h-3 w-3 opacity-50" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {entriesWithObservations.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-3 text-primary">
                <MessageSquare className="h-4 w-4" />
                Notas de Justificativa do Mês
              </h4>
              <div className="grid gap-2">
                {entriesWithObservations.map((entry) => (
                  <div key={entry.id} className="text-xs bg-muted/50 p-2 rounded-md border border-border/50 flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-bold mr-2 text-accent">
                        {format(parseISO(entry.date), "dd/MM")}:
                      </span>
                      <span className="text-muted-foreground italic">
                        "{entry.observations}"
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!justifyingDate} onOpenChange={(open) => !open && setJustifyingDate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Justificar Ausência</DialogTitle>
            <DialogDescription>
              Adicione uma observação para o dia {justifyingDate && format(justifyingDate, "dd/MM eeee", { locale: ptBR })}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Motivo / Observação</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Não houve reunião, semana do congresso..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="resize-none"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-primary hover:bg-accent font-semibold py-6"
              onClick={handleSaveJustification}
              disabled={!reason.trim()}
            >
              Salvar Justificativa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
