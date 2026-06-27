
import * as React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { InstallPwaPrompt } from '@/components/install-pwa-prompt';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Controle de Donativos',
  description: 'Gestão Financeira Consolidada para Congregações',
  icons: {
    icon: '/Ico.png',
    apple: '/Ico.png',
  },
  // O Next.js usará automaticamente o manifest.ts
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4A3AFF" />
        <link rel="apple-touch-icon" href="/Ico.png" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <InstallPwaPrompt />
          <Toaster />
        </FirebaseClientProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  console.log('PWA: Service Worker registrado com sucesso');
                }).catch(function(err) {
                  console.log('PWA: Falha ao registrar Service Worker:', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
