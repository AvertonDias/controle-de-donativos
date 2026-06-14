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
  observations?: string;
  createdAt?: any;
}

export function useLedger(selectedDate: Date) {
  const firestore = useFirestore();

  const year = selectedDate.getFullYear().toString();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');

  const donationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'donations', year, 'months', month, 'entries'), 
      orderBy('date', 'desc')
    );
  }, [firestore, year, month]);

  const { data: entries, loading } = useCollection<LedgerEntry>(donationsQuery);

  const addEntry = (entry: Omit<LedgerEntry, 'id' | 'dailySum'>) => {
    if (!firestore) return;

    const [eYear, eMonth] = entry.date.split('-');
    const dailySum = (entry.worldwideWork || 0) + (entry.congregation || 0);
    const donationData = {
      ...entry,
      dailySum,
      createdAt: serverTimestamp(),
    };

    const targetCollection = collection(firestore, 'donations', eYear, 'months', eMonth, 'entries');
    
    addDoc(targetCollection, donationData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: targetCollection.path,
          operation: 'create',
          requestResourceData: donationData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const updateEntry = (id: string, originalDate: string, entry: Omit<LedgerEntry, 'id' | 'dailySum' | 'createdAt'>) => {
    if (!firestore) return;

    const [oldYear, oldMonth] = originalDate.split('-');
    const [newYear, newMonth] = entry.date.split('-');
    
    const dailySum = (entry.worldwideWork || 0) + (entry.congregation || 0);
    const donationData = {
      ...entry,
      dailySum,
    };

    if (oldYear !== newYear || oldMonth !== newMonth) {
      deleteEntry(id, originalDate);
      addEntry(entry);
      return;
    }

    const docRef = doc(firestore, 'donations', newYear, 'months', newMonth, 'entries', id);
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

  const deleteEntry = (id: string, date: string) => {
    if (!firestore) return;

    const [y, m] = date.split('-');
    const docRef = doc(firestore, 'donations', y, 'months', m, 'entries', id);
    
    deleteDoc(docRef)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return { 
    entries: entries || [], 
    addEntry, 
    updateEntry,
    deleteEntry, 
    isLoaded: !loading 
  };
}