'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  appendActivityLog,
  getStoredClients,
  getStoredProjects,
  getStoredServiceTickets,
  setStoredServiceTickets
} from '@/lib/data-store';
import type { ServiceTicket } from '@/lib/types';
import { usePersistentState } from '@/lib/use-persistent-state';

export default function SavPage() {
  const { value: clients } = usePersistentState(getStoredClients);
  const { value: projects } = usePersistentState(getStoredProjects);
  const { value: tickets, setValue: setTickets } = usePersistentState(getStoredServiceTickets, setStoredServiceTickets);

  const [draft, setDraft] = useState({
    title: '',
    projectId: projects[0]?.id ?? '',
    clientId: clients[0]?.id ?? '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'moyenne' as ServiceTicket['priority']
  });

  const createTicket = () => {
    if (!draft.title.trim() || !draft.clientId || !draft.projectId) return;

    const ticket: ServiceTicket = {
      id: `sav_${crypto.randomUUID().slice(0, 8)}`,
      title: draft.title.trim(),
      projectId: draft.projectId,
      clientId: draft.clientId,
      dueDate: draft.dueDate,
      priority: draft.priority,
      status: 'ouvert'
    };

    setTickets((current) => [ticket, ...current]);
    appendActivityLog(`Ticket SAV ouvert : ${ticket.title}.`);
    setDraft((current) => ({ ...current, title: '' }));
  };

  const updateStatus = (id: string, status: ServiceTicket['status']) => {
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">SAV</h1>
        <p className="text-sm text-muted">Suivi des interventions post-livraison et réserves.</p>
      </div>

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
          <Button onClick={createTicket}>Créer ticket</Button>
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
                  <select value={ticket.status} onChange={(event) => updateStatus(ticket.id, event.target.value as ServiceTicket['status'])}>
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
