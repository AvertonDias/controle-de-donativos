
"use client";

import * as React from "react";
import { useLedger } from "@/lib/ledger-store";
import { SummaryCards } from "@/components/ledger/summary-cards";
import { LedgerTable } from "@/components/ledger/ledger-table";
import { AddEntryModal } from "@/components/ledger/add-entry-modal";
import { MonthSelector } from "@/components/ledger/month-selector";
import { BookOpen } from "lucide-react";
import { isSameMonth, parseISO } from "date-fns";

export default function Home({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  // Consumindo params e searchParams corretamente para Next.js 15
  React.use(paramsPromise);
  React.use(searchParamsPromise);

  const { entries, addEntry, deleteEntry, isLoaded } = useLedger();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());

  const filteredEntries = React.useMemo(() => {
    return (entries || []).filter((entry) => 
      isSameMonth(parseISO(entry.date), selectedMonth)
    );
  }, [entries, selectedMonth]);

  const filteredTotals = React.useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        worldwideWork: acc.worldwideWork + (entry.worldwideWork || 0),
        congregation: acc.congregation + (entry.congregation || 0),
        total: acc.total + (entry.dailySum || 0),
      }),
      { worldwideWork: 0, congregation: 0, total: 0 }
    );
  }, [filteredEntries]);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-primary font-headline text-xl">carregando</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-tight">
              Controle de Donativos
            </h1>
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hidden md:block">
            Livro de Registro Financeiro
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <MonthSelector currentDate={selectedMonth} onChange={setSelectedMonth} />
        </div>

        <section>
          <SummaryCards totals={filteredTotals} />
        </section>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-accent">Lançamentos do Mês</h2>
              <p className="text-muted-foreground text-sm">Gestão consolidada das contribuições locais e mundiais</p>
            </div>
          </div>
          <LedgerTable entries={filteredEntries} onDelete={deleteEntry} />
        </section>
      </main>

      <AddEntryModal onAdd={addEntry} />
      
      <footer className="mt-12 py-8 border-t text-center text-muted-foreground text-xs px-4">
        <p>© {new Date().getFullYear()} Controle de Donativos • Transparência e propósito na gestão financeira.</p>
      </footer>
    </div>
  );
}
