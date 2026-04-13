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
    <Card className="space-y-6 p-8 md:p-9">
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Espace sécurisé</p>
        <h1 className="text-3xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-muted">Accédez à votre espace chantier premium.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input className="w-full" type="password" placeholder="Mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
        <Button className="w-full" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
      <p className="text-center text-sm text-muted">Création de comptes gérée depuis les paramètres administrateur.</p>
    </Card>
  );
}
