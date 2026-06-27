"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useLedger } from "@/lib/ledger-store";
import { useUserSettings } from "@/lib/settings-store";
import { SummaryCards } from "@/components/ledger/summary-cards";
import { LedgerTable } from "@/components/ledger/ledger-table";
import { AddEntryModal } from "@/components/ledger/add-entry-modal";
import { MonthSelector } from "@/components/ledger/month-selector";
import { MonthlyAudit } from "@/components/ledger/monthly-audit";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  
  const { entries, addEntry, updateEntry, deleteEntry, isLoaded } = useLedger(selectedMonth, user?.uid);
  const { settings } = useUserSettings(user?.uid);

  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  const filteredTotals = React.useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        worldwideWork: acc.worldwideWork + (entry.worldwideWork || 0),
        congregation: acc.congregation + (entry.congregation || 0),
        total: acc.total + (entry.dailySum || 0),
      }),
      { worldwideWork: 0, congregation: 0, total: 0 }
    );
  }, [entries]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-headline text-xl">carregando</div>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-primary font-headline text-xl">conectando ao seu banco de dados</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-[60] shadow-sm">
        <div className="px-4 h-16 flex items-center justify-start gap-4">
          <SidebarTrigger className="text-primary hover:bg-primary/5">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image 
                src="/Ico.png" 
                alt="Logo" 
                fill 
                sizes="32px"
                className="object-cover"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-tight">
              Controle de Donativos
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <MonthSelector currentDate={selectedMonth} onChange={setSelectedMonth} />
        </div>

        <section>
          <SummaryCards totals={filteredTotals} />
        </section>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-accent">Seus Lançamentos</h2>
              <p className="text-muted-foreground text-sm">Gestão consolidada das suas contribuições</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <LedgerTable 
              entries={entries} 
              onDelete={deleteEntry} 
              onUpdate={updateEntry}
            />

            <div className="pt-8 border-t border-dashed">
              <div className="mb-6">
                <h2 className="text-xl font-headline font-bold text-accent">Conferência de Período</h2>
                <p className="text-muted-foreground text-sm">Verificação automática de registros baseada nas suas configurações</p>
              </div>
              <MonthlyAudit 
                entries={entries} 
                selectedMonth={selectedMonth} 
                meetingDays={settings.meetingDays}
                onAddJustification={addEntry} 
              />
            </div>
          </div>
        </section>
      </main>

      <AddEntryModal onAdd={addEntry} />
      
      <footer className="mt-12 py-8 border-t text-center text-muted-foreground text-xs px-4">
        <p>© {new Date().getFullYear()} Controle de Donativos • Transparência e propósito na gestão financeira.</p>
      </footer>
    </div>
  );
}
