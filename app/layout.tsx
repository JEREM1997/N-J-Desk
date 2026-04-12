import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'N&J Desk',
  description: 'Pilotage premium de chantiers et suivi client pour N&J Intérieurs',
  icons: {
    icon: '/branding/favicon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
