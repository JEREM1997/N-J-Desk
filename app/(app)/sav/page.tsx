'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listClients } from '@/lib/repositories/clients';
import { listProjects } from '@/lib/repositories/projects';
import { createServiceTicket, listServiceTickets, updateServiceTicketStatus } from '@/lib/repositories/service-tickets';
import type { ServiceTicket, Client, Project } from '@/lib/types';

export default function SavPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    title: '',
    projectId: '',
    clientId: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'moyenne' as ServiceTicket['priority']
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [clientRows, projectRows, ticketRows] = await Promise.all([listClients(), listProjects(), listServiceTickets()]);
        setClients(clientRows);
        setProjects(projectRows);
        setTickets(ticketRows);
        setDraft((current) => ({
          ...current,
          projectId: current.projectId || projectRows[0]?.id || '',
          clientId: current.clientId || clientRows[0]?.id || ''
        }));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement');
      }
    };

    void load();
  }, []);

  const handleCreateTicket = async () => {
    if (!draft.title.trim() || !draft.clientId || !draft.projectId) return;

    try {
      const created = await createServiceTicket({
        title: draft.title.trim(),
        projectId: draft.projectId,
        clientId: draft.clientId,
        dueDate: draft.dueDate,
        priority: draft.priority,
        status: 'ouvert'
      });

      setTickets((current) => [created, ...current]);
      setDraft((current) => ({ ...current, title: '' }));
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Création ticket impossible');
    }
  };

  const handleUpdateStatus = async (id: string, status: ServiceTicket['status']) => {
    const previous = tickets;
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));

    try {
      const updated = await updateServiceTicketStatus(id, status);
      setTickets((current) => current.map((ticket) => (ticket.id === id ? updated : ticket)));
    } catch {
      setTickets(previous);
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">SAV</h1>
        <p className="text-sm text-muted">Suivi des interventions post-livraison et réserves.</p>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold">Créer un ticket SAV</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input placeholder="Objet" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
          <select value={draft.projectId} onChange={(event) => setDraft((current) => ({ ...current, projectId: event.target.value }))}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
          <select value={draft.clientId} onChange={(event) => setDraft((current) => ({ ...current, clientId: event.target.value }))}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
            ))}
          </select>
          <input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
          <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as ServiceTicket['priority'] }))}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
            <option value="critique">Critique</option>
          </select>
          <Button onClick={() => void handleCreateTicket()}>Créer ticket</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Tickets en cours</h2>
        <ul className="mt-3 space-y-2">
          {tickets.map((ticket) => {
            const client = clients.find((entry) => entry.id === ticket.clientId);
            const project = projects.find((entry) => entry.id === ticket.projectId);

            return (
              <li key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.05] px-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-xs text-muted">{project?.title} · {client?.firstName} {client?.lastName} · Échéance {ticket.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={ticket.priority === 'critique' ? 'warning' : 'muted'}>{ticket.priority}</Badge>
                  <select value={ticket.status} onChange={(event) => void handleUpdateStatus(ticket.id, event.target.value as ServiceTicket['status'])}>
                    <option value="ouvert">Ouvert</option>
                    <option value="planifie">Planifié</option>
                    <option value="resolu">Résolu</option>
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
