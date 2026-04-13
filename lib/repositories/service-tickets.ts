import { ServiceTicket } from '@/lib/types';
import { supabaseDelete, supabaseInsert, supabaseSelect, supabaseUpdate } from './base';

interface ServiceTicketRow {
  id: string;
  project_id: string;
  client_id: string;
  title: string;
  priority: ServiceTicket['priority'];
  status: ServiceTicket['status'];
  due_date: string | null;
}

function toTicket(row: ServiceTicketRow): ServiceTicket {
  return {
    id: row.id,
    projectId: row.project_id,
    clientId: row.client_id,
    title: row.title,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date ?? ''
  };
}

export async function listServiceTickets() {
  const rows = await supabaseSelect<ServiceTicketRow>('service_tickets', 'select=id,project_id,client_id,title,priority,status,due_date&order=created_at.desc');
  return rows.map(toTicket);
}

export async function createServiceTicket(ticket: Omit<ServiceTicket, 'id'>) {
  const row = await supabaseInsert<ServiceTicketRow>('service_tickets', {
    project_id: ticket.projectId,
    client_id: ticket.clientId,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    due_date: ticket.dueDate
  });

  return toTicket(row);
}

export async function updateServiceTicketStatus(id: string, status: ServiceTicket['status']) {
  const row = await supabaseUpdate<ServiceTicketRow>('service_tickets', id, { status });
  return toTicket(row);
}

export async function deleteServiceTicket(id: string) {
  await supabaseDelete('service_tickets', id);
}
