import { Client } from '@/lib/types';
import { supabaseDelete, supabaseInsert, supabaseSelect, supabaseUpdate } from './base';

interface ClientRow {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  postal_code: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
}

function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? '',
    postalCode: row.postal_code ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
    notes: row.notes ?? '',
  };
}

function toRow(client: Partial<Client>) {
  return {
    first_name: client.firstName,
    last_name: client.lastName,
    phone: client.phone,
    postal_code: client.postalCode,
    email: client.email,
    address: client.address,
    notes: client.notes
  };
}

export async function listClients() {
  const rows = await supabaseSelect<ClientRow>('clients', 'select=id,first_name,last_name,phone,postal_code,email,address,notes&order=created_at.desc');
  return rows.map(toClient);
}

export async function createClient(client: Omit<Client, 'id'>) {
  const row = await supabaseInsert<ClientRow>('clients', toRow(client));
  return toClient(row);
}

export async function updateClient(id: string, patch: Partial<Omit<Client, 'id'>>) {
  const row = await supabaseUpdate<ClientRow>('clients', id, toRow(patch));
  return toClient(row);
}

export async function deleteClient(id: string) {
  await supabaseDelete('clients', id);
}
