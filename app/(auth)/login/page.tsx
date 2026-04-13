'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signInWithPassword } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithPassword(email.trim(), password);
      router.replace('/dashboard');
      router.refresh();
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Connexion impossible';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-7 border-white/20 bg-white/95 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-9">
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Espace sécurisé</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Connexion</h1>
        <p className="text-sm text-muted">Accédez à votre cockpit N&J Desk.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Email</span>
          <input className="w-full" type="email" placeholder="vous@entreprise.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Mot de passe</span>
          <input className="w-full" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
        <Button className="w-full py-3" disabled={loading}>{loading ? 'Connexion en cours…' : 'Se connecter'}</Button>
      </form>
      <p className="text-center text-xs text-muted">Création de comptes gérée depuis les paramètres administrateur.</p>
    </Card>
  );
}
