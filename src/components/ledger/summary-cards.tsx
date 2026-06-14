
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Wallet } from "lucide-react";

interface SummaryCardsProps {
  totals: {
    worldwideWork: number;
    congregation: number;
    total: number;
  };
}

export function SummaryCards({ totals }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const items = [
    {
      title: "Obra Mundial",
      value: formatCurrency(totals.worldwideWork),
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Congregação",
      value: formatCurrency(totals.congregation),
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Acumulado",
      value: formatCurrency(totals.total),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {item.title}
            </CardTitle>
            <div className={`${item.bgColor} p-2 rounded-lg`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
