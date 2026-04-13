'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ensureUserProfile, getStoredSession } from '@/lib/supabase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapSession = async () => {
      const session = getStoredSession();
      if (!session?.access_token) {
        router.replace('/login');
        return;
      }

      try {
        await ensureUserProfile(session);
        setReady(true);
      } catch (profileError) {
        setError(profileError instanceof Error ? profileError.message : 'Session invalide');
      }
    };

    void bootstrapSession();
  }, [router]);

  if (!ready) {
    if (error) {
      return <div className="p-6 text-sm text-rose-700">Erreur session: {error}</div>;
    }
    return <div className="p-6 text-sm text-muted">Vérification de la session…</div>;
  }

  return <>{children}</>;
}
