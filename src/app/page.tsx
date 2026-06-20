"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { useLedger } from "@/lib/ledger-store";
import { useUserSettings } from "@/lib/settings-store";
import { SummaryCards } from "@/components/ledger/summary-cards";
import { LedgerTable } from "@/components/ledger/ledger-table";
import { AddEntryModal } from "@/components/ledger/add-entry-modal";
import { MonthSelector } from "@/components/ledger/month-selector";
import { MonthlyAudit } from "@/components/ledger/monthly-audit";
import { LogOut, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
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
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-primary/10">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-primary">{user.displayName || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/annual")} className="cursor-pointer">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Resumo Anual</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer font-semibold">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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