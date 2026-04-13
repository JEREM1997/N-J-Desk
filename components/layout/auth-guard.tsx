'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ensureUserProfile, getStoredSession } from '@/lib/supabase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrapSession = async () => {
      const session = getStoredSession();
      if (!session?.access_token) {
        router.replace('/login');
        return;
      }

      await ensureUserProfile(session);
      setReady(true);
    };

    void bootstrapSession();
  }, [router]);

  if (!ready) {
    return <div className="p-6 text-sm text-muted">Vérification de la session…</div>;
  }

  return <>{children}</>;
}
