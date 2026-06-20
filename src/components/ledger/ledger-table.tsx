"use client";

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LedgerEntry } from "@/lib/ledger-store";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, Pencil, ArrowUpDown, ArrowUp, ArrowDown, Info, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditEntryModal } from "./edit-entry-modal";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
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

interface LedgerTableProps {
  entries: LedgerEntry[];
  onDelete: (id: string, date: string) => void;
  onUpdate: (id: string, originalDate: string, entry: Omit<LedgerEntry, 'id' | 'dailySum' | 'createdAt'>) => void;
}

type SortConfig = {
  key: keyof LedgerEntry;
  direction: 'asc' | 'desc';
} | null;

export function LedgerTable({ entries, onDelete, onUpdate }: LedgerTableProps) {
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<LedgerEntry | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSort = (key: keyof LedgerEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = useMemo(() => {
    let sortableItems = [...entries];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = (a[sortConfig.key] as any) || '';
        const bValue = (b[sortConfig.key] as any) || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [entries, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: keyof LedgerEntry }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      onDelete(entryToDelete.id, entryToDelete.date);
      setEntryToDelete(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="p-12 text-center bg-card rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground">
        <p className="font-headline text-xl italic">Nenhum registro encontrado</p>
        <p className="text-sm mt-2">Os seus lançamentos aparecerão aqui após serem adicionados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visualização em Cards (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden border-primary/10 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-lg text-primary capitalize">
                    {format(parseISO(entry.date), "dd/MM eeee", { locale: ptBR })}
                  </span>
                  {entry.observations && (
                    <span className="text-xs text-muted-foreground italic mt-1 line-clamp-2">
                      "{entry.observations}"
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => setEditingEntry(entry)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setEntryToDelete(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Globe className="h-3 w-3" />
                    Obra Mundial
                  </div>
                  <div className="text-sm font-semibold">{formatCurrency(entry.worldwideWork)}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Users className="h-3 w-3" />
                    Congregação
                  </div>
                  <div className="text-sm font-semibold">{formatCurrency(entry.congregation)}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase">Total do Dia</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(entry.dailySum)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visualização em Tabela (Desktop) */}
      <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead 
                className="font-headline text-primary font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Data
                  <SortIcon columnKey="date" />
                </div>
              </TableHead>
              <TableHead 
                className="font-headline text-primary font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('worldwideWork')}
              >
                <div className="flex items-center">
                  Obra Mundial
                  <SortIcon columnKey="worldwideWork" />
                </div>
              </TableHead>
              <TableHead 
                className="font-headline text-primary font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('congregation')}
              >
                <div className="flex items-center">
                  Congregação
                  <SortIcon columnKey="congregation" />
                </div>
              </TableHead>
              <TableHead 
                className="font-headline text-primary font-bold text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('dailySum')}
              >
                <div className="flex items-center justify-end">
                  Soma do Dia
                  <SortIcon columnKey="dailySum" />
                </div>
              </TableHead>
              <TableHead className="w-24 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id} className="animate-slide-up hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium whitespace-nowrap capitalize">
                  <div className="flex flex-col">
                    <span>{format(parseISO(entry.date), "dd/MM eeee", { locale: ptBR })}</span>
                    {entry.observations && (
                      <span className="text-[10px] text-muted-foreground font-normal italic line-clamp-1 max-w-[150px]">
                        {entry.observations}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(entry.worldwideWork)}</TableCell>
                <TableCell>{formatCurrency(entry.congregation)}</TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {formatCurrency(entry.dailySum)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {entry.observations && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/60">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px] text-xs">{entry.observations}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setEditingEntry(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => setEntryToDelete(entry)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditEntryModal 
        entry={editingEntry} 
        onClose={() => setEditingEntry(null)} 
        onUpdate={onUpdate} 
      />

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro de donativo do dia {entryToDelete && format(parseISO(entryToDelete.date), "dd/MM/yyyy")} será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar para apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
