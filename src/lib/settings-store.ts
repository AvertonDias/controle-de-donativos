
"use client";

import { useMemo } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface UserSettings {
  meetingDays: number[]; // [0, 1, 2, 3, 4, 5, 6] onde 0 é domingo
}

const DEFAULT_SETTINGS: UserSettings = {
  meetingDays: [4, 6], // Quinta e Sábado por padrão
};

export function useUserSettings(userId: string | undefined) {
  const firestore = useFirestore();

  const settingsRef = useMemo(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, 'users', userId, 'settings', 'general');
  }, [firestore, userId]);

  const { data: settingsData, loading } = useDoc<UserSettings>(settingsRef);

  const settings = settingsData || DEFAULT_SETTINGS;

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    if (!settingsRef) return;

    const data = { ...settings, ...newSettings };
    
    setDoc(settingsRef, data, { merge: true })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return {
    settings,
    updateSettings,
    loading
  };
}
