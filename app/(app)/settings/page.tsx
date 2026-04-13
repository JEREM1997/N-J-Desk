'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase';

export default function SettingsPage() {
  const logout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Paramètres</h1>
        <p className="text-sm text-muted">Gérez votre session et la sécurité de l&apos;application.</p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Session</h2>
        <p className="text-sm text-muted">
          Déconnectez-vous pour changer de compte ou sécuriser l&apos;accès depuis cet appareil.
        </p>
        <Button className="w-fit border border-zinc-300 bg-zinc-100 text-zinc-800 shadow-none hover:bg-zinc-200" onClick={logout}>
          Se déconnecter
        </Button>
      </Card>
    </section>
  );
}
