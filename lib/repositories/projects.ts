import { Project, ProjectStatus } from '@/lib/types';
import { supabaseDelete, supabaseInsert, supabaseSelect, supabaseUpdate } from './base';

interface ProjectRow {
  id: string;
  client_id: string;
  title: string;
  site_address: string | null;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  estimated_end_date: string | null;
  quote_amount: number | null;
  billed_amount: number | null;
  deposit_received: number | null;
  balance_received: number | null;
  internal_notes: string | null;
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    address: row.site_address ?? '',
    description: row.description ?? '',
    status: row.status,
    startDate: row.start_date ?? '',
    estimatedEndDate: row.estimated_end_date ?? '',
    quoteAmount: Number(row.quote_amount ?? 0),
    billedAmount: Number(row.billed_amount ?? 0),
    depositReceived: Number(row.deposit_received ?? 0),
    balanceReceived: Number(row.balance_received ?? 0),
    internalNotes: row.internal_notes ?? ''
  };
}

function toRow(project: Partial<Project>) {
  const nullableDate = (value: string | undefined) => {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  };

  return {
    client_id: project.clientId,
    title: project.title,
    site_address: project.address,
    description: project.description,
    status: project.status,
    start_date: nullableDate(project.startDate),
    estimated_end_date: nullableDate(project.estimatedEndDate),
    quote_amount: project.quoteAmount,
    billed_amount: project.billedAmount,
    deposit_received: project.depositReceived,
    balance_received: project.balanceReceived,
    internal_notes: project.internalNotes
  };
}

export async function listProjects() {
  const rows = await supabaseSelect<ProjectRow>(
    'projects',
    'select=id,client_id,title,site_address,description,status,start_date,estimated_end_date,quote_amount,billed_amount,deposit_received,balance_received,internal_notes&order=created_at.desc'
  );
  return rows.map(toProject);
}

export async function createProject(project: Omit<Project, 'id'>) {
  const row = await supabaseInsert<ProjectRow>('projects', toRow(project));
  return toProject(row);
}

export async function updateProject(id: string, patch: Partial<Omit<Project, 'id'>>) {
  const row = await supabaseUpdate<ProjectRow>('projects', id, toRow(patch));
  return toProject(row);
}

export async function deleteProject(id: string) {
  await supabaseDelete('projects', id);
}
