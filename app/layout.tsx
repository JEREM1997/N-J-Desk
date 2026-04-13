import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'N&J Desk',
  description: 'Pilotage premium de chantiers et suivi client pour N&J Intérieurs',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/branding/favicon.svg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'N&J Desk'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
