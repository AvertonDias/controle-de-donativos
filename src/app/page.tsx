
"use client";

import { useLedger } from "@/lib/ledger-store";
import { SummaryCards } from "@/components/ledger/summary-cards";
import { LedgerTable } from "@/components/ledger/ledger-table";
import { AddEntryModal } from "@/components/ledger/add-entry-modal";
import { ProjectionTool } from "@/components/ledger/projection-tool";
import { BookOpen } from "lucide-react";

export default function Home() {
  const { entries, addEntry, deleteEntry, totals, isLoaded } = useLedger();

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary font-headline text-xl">Carregando...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tight">
              Controle de Donativos
            </h1>
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hidden sm:block">
            Livro de Registro Financeiro
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <section>
          <SummaryCards totals={totals} />
        </section>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-accent">Lançamentos Diários</h2>
              <p className="text-muted-foreground text-sm">Gestão consolidada das contribuições locais e mundiais</p>
            </div>
          </div>
          <LedgerTable entries={entries} onDelete={deleteEntry} />
        </section>

        <section>
          <ProjectionTool entries={entries} />
        </section>
      </main>

      <AddEntryModal onAdd={addEntry} />
      
      <footer className="mt-12 py-8 border-t text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Controle de Donativos • Transparência e propósito na gestão financeira.</p>
      </footer>
    </div>
  );
}
