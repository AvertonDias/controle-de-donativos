
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, TrendingUp, Info } from "lucide-react";
import { smartProjectionTool, SmartProjectionToolOutput } from "@/ai/flows/smart-projection-tool-flow";
import { LedgerEntry } from "@/lib/ledger-store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ProjectionToolProps {
  entries: LedgerEntry[];
}

export function ProjectionTool({ entries }: ProjectionToolProps) {
  const [loading, setLoading] = useState(false);
  const [projection, setProjection] = useState<SmartProjectionToolOutput | null>(null);

  const handleProject = async () => {
    if (entries.length < 3) return;
    setLoading(true);
    try {
      const historicalData = entries.map(e => ({
        date: e.date,
        worldwideWork: e.worldwideWork,
        congregation: e.congregation
      }));
      const result = await smartProjectionTool({
        historicalData,
        projectionPeriod: "next month"
      });
      setProjection(result);
    } catch (error) {
      console.error("AI projection failed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Análise Inteligente</h2>
          <p className="text-muted-foreground text-sm">Previsões baseadas no histórico da congregação</p>
        </div>
        <Button 
          onClick={handleProject} 
          disabled={loading || entries.length < 3}
          className="bg-primary hover:bg-accent gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Processando..." : "Gerar Projeção"}
        </Button>
      </div>

      {entries.length < 3 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Dados Insuficientes</AlertTitle>
          <AlertDescription>
            Adicione pelo menos 3 registros para que a IA possa identificar padrões e gerar projeções precisas.
          </AlertDescription>
        </Alert>
      )}

      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Previsão para o Próximo Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Obra Mundial</span>
                <span className="font-bold">{formatCurrency(projection.forecasts.worldwideWork)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Congregação</span>
                <span className="font-bold">{formatCurrency(projection.forecasts.congregation)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-headline font-bold">Total Projetado</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(projection.forecasts.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Tendências Identificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {projection.trends.map((trend, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
