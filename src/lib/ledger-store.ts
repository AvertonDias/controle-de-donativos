
"use client";

import { useState, useEffect } from 'react';

export interface LedgerEntry {
  id: string;
  date: string;
  worldwideWork: number;
  congregation: number;
  dailySum: number;
}

const STORAGE_KEY = 'uniteledger_entries';

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntry = (entry: Omit<LedgerEntry, 'id' | 'dailySum'>) => {
    const dailySum = entry.worldwideWork + entry.congregation;
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      dailySum,
    };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const totals = entries.reduce(
    (acc, entry) => ({
      worldwideWork: acc.worldwideWork + entry.worldwideWork,
      congregation: acc.congregation + entry.congregation,
      total: acc.total + entry.dailySum,
    }),
    { worldwideWork: 0, congregation: 0, total: 0 }
  );

  return { entries, addEntry, deleteEntry, totals, isLoaded };
}
