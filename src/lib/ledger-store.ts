
"use client";

import { useMemo } from 'react';
import { collection, query, orderBy, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface LedgerEntry {
  id: string;
  date: string;
  worldwideWork: number;
  congregation: number;
  dailySum: number;
  createdAt?: any;
}

export function useLedger() {
  const firestore = useFirestore();

  const donationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'donations'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: entries, loading } = useCollection<LedgerEntry>(donationsQuery);

  const addEntry = (entry: Omit<LedgerEntry, 'id' | 'dailySum'>) => {
    if (!firestore) return;

    const dailySum = entry.worldwideWork + entry.congregation;
    const donationData = {
      ...entry,
      dailySum,
      createdAt: serverTimestamp(),
    };

    addDoc(collection(firestore, 'donations'), donationData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'donations',
          operation: 'create',
          requestResourceData: donationData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const updateEntry = (id: string, entry: Omit<LedgerEntry, 'id' | 'dailySum' | 'createdAt'>) => {
    if (!firestore) return;

    const dailySum = entry.worldwideWork + entry.congregation;
    const donationData = {
      ...entry,
      dailySum,
    };

    const docRef = doc(firestore, 'donations', id);
    updateDoc(docRef, donationData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: donationData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const deleteEntry = (id: string) => {
    if (!firestore) return;

    const docRef = doc(firestore, 'donations', id);
    deleteDoc(docRef)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const totals = useMemo(() => {
    return (entries || []).reduce(
      (acc, entry) => ({
        worldwideWork: acc.worldwideWork + (entry.worldwideWork || 0),
        congregation: acc.congregation + (entry.congregation || 0),
        total: acc.total + (entry.dailySum || 0),
      }),
      { worldwideWork: 0, congregation: 0, total: 0 }
    );
  }, [entries]);

  return { 
    entries: entries || [], 
    addEntry, 
    updateEntry,
    deleteEntry, 
    totals, 
    isLoaded: !loading 
  };
}
