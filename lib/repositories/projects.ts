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

  const row: Record<string, unknown> = {};

  if ('clientId' in project) row.client_id = project.clientId;
  if ('title' in project) row.title = project.title;
  if ('address' in project) row.site_address = project.address;
  if ('description' in project) row.description = project.description;
  if ('status' in project) row.status = project.status;
  if ('startDate' in project) row.start_date = nullableDate(project.startDate);
  if ('estimatedEndDate' in project) row.estimated_end_date = nullableDate(project.estimatedEndDate);
  if ('quoteAmount' in project) row.quote_amount = project.quoteAmount;
  if ('billedAmount' in project) row.billed_amount = project.billedAmount;
  if ('depositReceived' in project) row.deposit_received = project.depositReceived;
  if ('balanceReceived' in project) row.balance_received = project.balanceReceived;
  if ('internalNotes' in project) row.internal_notes = project.internalNotes;

  return row;
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
