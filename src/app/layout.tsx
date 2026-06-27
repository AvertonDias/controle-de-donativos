
import * as React from 'react';
import type { Metadata, Viewport } from 'next';
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
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#4A3AFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
                  console.log('PWA: Service Worker registrado');
                }).catch(function(err) {
                  console.log('PWA: Erro no SW:', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
