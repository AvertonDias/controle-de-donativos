"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LedgerEntry } from "@/lib/ledger-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LedgerTableProps {
  entries: LedgerEntry[];
  onDelete: (id: string) => void;
}

export function LedgerTable({ entries, onDelete }: LedgerTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (entries.length === 0) {
    return (
      <div className="p-12 text-center bg-card rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground">
        <p className="font-headline text-xl">ainda não está salvando no bd</p>
        <p className="text-sm">Verifique se o Firestore está ativo e as regras de segurança permitem gravação.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-headline text-primary font-bold">Data</TableHead>
            <TableHead className="font-headline text-primary font-bold">Obra Mundial</TableHead>
            <TableHead className="font-headline text-primary font-bold">Congregação</TableHead>
            <TableHead className="font-headline text-primary font-bold text-right">Soma do Dia</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className="animate-slide-up hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium whitespace-nowrap">
                {format(new Date(entry.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>{formatCurrency(entry.worldwideWork)}</TableCell>
              <TableCell>{formatCurrency(entry.congregation)}</TableCell>
              <TableCell className="text-right font-bold text-primary">
                {formatCurrency(entry.dailySum)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
