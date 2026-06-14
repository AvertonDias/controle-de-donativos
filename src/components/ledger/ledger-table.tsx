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
import { Trash2, Pencil, ArrowUpDown, ArrowUp, ArrowDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditEntryModal } from "./edit-entry-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  if (entries.length === 0) {
    return (
      <div className="p-12 text-center bg-card rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground">
        <p className="font-headline text-xl italic">ainda não está salvando no bd</p>
        <p className="text-sm mt-2">Nenhum registro encontrado para este período.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
                    onClick={() => onDelete(entry.id, entry.date)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditEntryModal 
        entry={editingEntry} 
        onClose={() => setEditingEntry(null)} 
        onUpdate={onUpdate} 
      />
    </div>
  );
}