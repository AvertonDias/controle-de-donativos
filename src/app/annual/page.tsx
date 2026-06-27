"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Menu, Globe, Users, Wallet, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthlyTotal {
  month: string;
  worldwideWork: number;
  congregation: number;
  total: number;
}

export default function AnnualSummaryPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [data, setData] = React.useState<MonthlyTotal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const availableYears = React.useMemo(() => {
    const list = [];
    for (let i = 2020; i <= 2030; i++) {
      list.push(i);
    }
    return list;
  }, []);

  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  React.useEffect(() => {
    if (!user) return;

    const fetchAnnualData = async () => {
      setLoading(true);
      const yearStr = year.toString();
      const monthsData: MonthlyTotal[] = [];

      try {
        for (let m = 1; m <= 12; m++) {
          const monthStr = m.toString().padStart(2, '0');
          const entriesRef = collection(firestore, 'users', user.uid, 'donations', yearStr, 'months', monthStr, 'entries');
          const snapshot = await getDocs(entriesRef);
          
          let worldwide = 0;
          let congregation = 0;
          let total = 0;

          snapshot.forEach(doc => {
            const entry = doc.data();
            worldwide += entry.worldwideWork || 0;
            congregation += entry.congregation || 0;
            total += entry.dailySum || 0;
          });

          monthsData.push({
            month: monthStr,
            worldwideWork: worldwide,
            congregation: congregation,
            total: total
          });
        }
        setData(monthsData);
      } catch (error) {
        console.error("Erro ao carregar dados anuais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnualData();
  }, [user, year, firestore]);

  const annualTotals = React.useMemo(() => {
    return data.reduce((acc, curr) => ({
      worldwideWork: acc.worldwideWork + curr.worldwideWork,
      congregation: acc.congregation + curr.congregation,
      total: acc.total + curr.total
    }), { worldwideWork: 0, congregation: 0, total: 0 });
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-headline text-xl">consolidando dados anuais...</div>
      </div>
    );
  }

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
              Resumo Anual
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mt-8 flex items-center gap-2">
          <div className="flex items-center bg-white p-1 rounded-xl border shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setYear(year - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="px-4 flex items-center gap-2 h-9 hover:bg-muted/50"
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-headline font-bold text-lg">
                    Ano de {year}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="center">
                <div className="grid grid-cols-2 gap-1">
                  {availableYears.map((y) => (
                    <Button
                      key={y}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-sm font-bold",
                        year === y && "bg-primary text-white hover:bg-primary hover:text-white"
                      )}
                      onClick={() => {
                        setYear(y);
                        setIsPopoverOpen(false);
                      }}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setYear(year + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-4 w-4" /> Obra Mundial (Ano)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-blue-900">
                {formatCurrency(annualTotals.worldwideWork)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4" /> Congregação (Ano)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-indigo-900">
                {formatCurrency(annualTotals.congregation)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Total Consolidado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-primary">
                {formatCurrency(annualTotals.total)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Detalhamento por Mês</CardTitle>
            <CardDescription>Valores acumulados em cada período de {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Mês</TableHead>
                  <TableHead className="font-bold">Obra Mundial</TableHead>
                  <TableHead className="font-bold">Congregação</TableHead>
                  <TableHead className="text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((m) => (
                  <TableRow key={m.month}>
                    <TableCell className="font-medium capitalize">
                      {format(new Date(year, parseInt(m.month) - 1, 1), "MMMM", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{formatCurrency(m.worldwideWork)}</TableCell>
                    <TableCell>{formatCurrency(m.congregation)}</TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(m.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
