
"use client";

import React from 'react';
import { LedgerEntry } from '@/lib/ledger-store';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isThursday, 
  isSaturday, 
  format,
  isSameDay,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MonthlyAuditProps {
  entries: LedgerEntry[];
  selectedMonth: Date;
}

export function MonthlyAudit({ entries, selectedMonth }: MonthlyAuditProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  // Encontra todas as quintas e sábados do mês
  const expectedDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
    .filter(date => isThursday(date) || isSaturday(date));

  const missingDates = expectedDates.filter(expectedDate => {
    return !entries.find(entry => isSameDay(parseISO(entry.date), expectedDate));
  });

  const allRecorded = missingDates.length === 0;

  return (
    <Card className={`mb-8 border-l-4 ${allRecorded ? 'border-l-green-500' : 'border-l-amber-500'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Conferência de Registros (Quintas e Sábados)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allRecorded ? (
          <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Todos os dias de reunião deste mês possuem um registro de donativo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Existem dias de reunião sem lançamentos:</p>
                <p className="text-xs opacity-80 mt-1">
                  Verifique se houve donativos nestas datas para garantir que o fechamento esteja correto.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {missingDates.map((date, idx) => (
                <Badge key={idx} variant="outline" className="bg-white hover:bg-white text-amber-700 border-amber-200 capitalize py-1 px-2">
                  {format(date, "dd/MM eeee", { locale: ptBR })}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
