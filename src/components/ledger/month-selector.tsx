"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, setMonth, setYear, getYear, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function MonthSelector({ currentDate, onChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentYear = getYear(currentDate);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(currentDate, monthIndex);
    onChange(newDate);
    setIsOpen(false);
  };

  const handleYearChange = (offset: number) => {
    onChange(setYear(currentDate, currentYear + offset));
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center bg-white p-1 rounded-xl border shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={() => onChange(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="px-4 flex items-center gap-2 h-9 hover:bg-muted/50"
            >
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-headline font-bold text-base capitalize">
                {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg font-headline">{currentYear}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-xs px-1",
                      getMonth(currentDate) === index && "bg-primary text-white hover:bg-primary hover:text-white"
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={() => onChange(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
