
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export function MonthSelector({ currentDate, onChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-xs mx-auto md:mx-0 bg-white p-1 rounded-xl border shadow-sm mb-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9"
        onClick={() => onChange(subMonths(currentDate, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 px-2 flex-1 justify-center">
        <CalendarIcon className="h-4 w-4 text-primary" />
        <span className="font-headline font-bold text-base capitalize">
          {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9"
        onClick={() => onChange(addMonths(currentDate, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
