export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
  };
}

const SESSION_STORAGE_KEY = 'njdesk.supabase.session';

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStoredSession(): SupabaseAuthSession | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SupabaseAuthSession;
  } catch {
    return null;
  }
}

function setStoredSession(session: SupabaseAuthSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function signInWithPassword(email: string, password: string) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Configuration Supabase manquante');

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error_description || error.msg || 'Connexion impossible');
  }

  const session = (await response.json()) as SupabaseAuthSession;
  setStoredSession(session);
  await ensureUserProfile(session);
  return session;
}

export async function signOut() {
  const config = getSupabaseConfig();
  const session = getStoredSession();

  if (config && session?.access_token) {
    await fetch(`${config.url}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.access_token}`
      }
    }).catch(() => undefined);
  }

  clearStoredSession();
}

export async function ensureUserProfile(session: SupabaseAuthSession) {
  const config = getSupabaseConfig();
  if (!config) return;

  const selectResponse = await fetch(
    `${config.url}/rest/v1/users?select=id&auth_user_id=eq.${session.user.id}&limit=1`,
    {
      method: 'GET',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.access_token}`
      }
    }
  );

  if (!selectResponse.ok) return;
  const existing = (await selectResponse.json()) as Array<{ id: string }>;
  if (existing.length > 0) return;

  await fetch(`${config.url}/rest/v1/users`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      auth_user_id: session.user.id
    })
  });
}
