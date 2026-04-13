import { getStoredSession, getSupabaseConfig } from '@/lib/supabase';

async function buildSupabaseError(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null);

  if (payload && typeof payload === 'object') {
    const details =
      (typeof payload.message === 'string' && payload.message) ||
      (typeof payload.error_description === 'string' && payload.error_description) ||
      (typeof payload.error === 'string' && payload.error) ||
      (typeof payload.hint === 'string' && payload.hint) ||
      '';

    if (details) return `${fallback} (${details})`;
  }

  return `${fallback} (HTTP ${response.status})`;
}

function getAuthHeaders() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Configuration Supabase manquante');
  }

  const session = getStoredSession();

  return {
    config,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session?.access_token ?? config.anonKey}`,
      'Content-Type': 'application/json'
    }
  };
}

function getAuthContext() {
  const { config, headers } = getAuthHeaders();
  return { config, token: headers.Authorization.replace('Bearer ', ''), apikey: headers.apikey };
}

export async function supabaseSelect<T>(table: string, query: string) {
  const { config, headers } = getAuthHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(await buildSupabaseError(response, `Erreur lecture ${table}`));
  }

  return (await response.json()) as T[];
}

export async function supabaseInsert<T>(table: string, payload: Record<string, unknown>) {
  const { config, headers } = getAuthHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await buildSupabaseError(response, `Erreur création ${table}`));
  }

  const rows = (await response.json()) as T[];
  return rows[0] as T;
}

export async function supabaseUpdate<T>(table: string, id: string, payload: Record<string, unknown>) {
  const { config, headers } = getAuthHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await buildSupabaseError(response, `Erreur modification ${table}`));
  }

  const rows = (await response.json()) as T[];
  return rows[0] as T;
}

export async function supabaseDelete(table: string, id: string) {
  const { config, headers } = getAuthHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    throw new Error(await buildSupabaseError(response, `Erreur suppression ${table}`));
  }
}

export async function supabaseUploadObject(bucket: string, objectPath: string, file: File) {
  const { config, token, apikey } = getAuthContext();

  const response = await fetch(`${config.url}/storage/v1/object/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey,
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false'
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(await buildSupabaseError(response, 'Upload fichier impossible'));
  }
}
