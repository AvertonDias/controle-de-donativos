import * as React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { InstallPwaPrompt } from '@/components/install-pwa-prompt';

export const metadata: Metadata = {
  title: 'Controle de Donativos',
  description: 'Gestão Financeira Consolidada para Congregações',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/Ico.png' },
      { url: '/Ico.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/Ico.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Donativos',
  },
};

export default async function RootLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  await paramsPromise;

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4A3AFF" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <InstallPwaPrompt />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}