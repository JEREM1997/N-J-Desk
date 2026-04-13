'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { clients, projects as initialProjects } from '@/lib/mock-data';
import { Project, ProjectStatus } from '@/lib/types';

const statusLabel: Record<ProjectStatus, string> = {
  prospect: 'Prospect',
  devis_envoye: 'Devis envoyé',
  devis_accepte: 'Devis accepté',
  planifie: 'Planifié',
  en_cours: 'En cours',
  termine: 'Terminé',
  sav: 'SAV'
};

const emptyProjectDraft = {
  title: '',
  address: '',
  clientId: clients[0]?.id ?? '',
  status: 'prospect' as ProjectStatus
};

function getCityFromAddress(address: string) {
  const chunks = address.split(',').map((chunk) => chunk.trim()).filter(Boolean);
  return chunks[chunks.length - 1] ?? '';
}

export default function ProjectsPage() {
  const [projectItems, setProjectItems] = useState<Project[]>(initialProjects);
  const [draft, setDraft] = useState(emptyProjectDraft);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const sortedProjects = useMemo(
    () => [...projectItems].sort((a, b) => a.startDate.localeCompare(b.startDate) * -1),
    [projectItems]
  );

  const createProject = () => {
    if (!draft.title.trim() || !draft.address.trim() || !draft.clientId) return;

    const newProject: Project = {
      id: `cha_${crypto.randomUUID().slice(0, 8)}`,
      title: draft.title.trim(),
      address: draft.address.trim(),
      clientId: draft.clientId,
      status: draft.status,
      description: '',
      startDate: new Date().toISOString().slice(0, 10),
      estimatedEndDate: '',
      quoteAmount: 0,
      billedAmount: 0,
      depositReceived: 0,
      balanceReceived: 0,
      internalNotes: ''
    };

    setProjectItems((current) => [newProject, ...current]);
    setDraft(emptyProjectDraft);
  };

  const deleteProject = (id: string) => {
    setProjectItems((current) => current.filter((project) => project.id !== id));
    if (editingProjectId === id) setEditingProjectId(null);
  };

  const updateProjectNote = (id: string, note: string) => {
    setProjectItems((current) =>
      current.map((project) => (project.id === id ? { ...project, internalNotes: note } : project))
    );
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="luxury-title">Chantiers</h1>
          <p className="text-sm text-muted">Suivi opérationnel et financier de vos dossiers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Titre du chantier"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />
          <input
            placeholder="Adresse du chantier"
            value={draft.address}
            onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
          />
          <select
            value={draft.clientId}
            onChange={(event) => setDraft((current) => ({ ...current, clientId: event.target.value }))}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
          <Button onClick={createProject}>Nouveau chantier</Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedProjects.map((project) => {
          const client = clients.find((entry) => entry.id === project.clientId);
          const city = getCityFromAddress(project.address);
          const isEditing = editingProjectId === project.id;

          return (
            <Card key={project.id} className="space-y-4 premium-hover">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{project.title}</h2>
                  <p className="text-sm text-muted">
                    {project.address}
                    {city && client?.postalCode ? ` · ${client.postalCode} ${city}` : ''}
                  </p>
                </div>
                <Badge tone={project.status === 'en_cours' ? 'success' : 'default'}>{statusLabel[project.status]}</Badge>
              </div>

              <div className="grid gap-3 rounded-xl border border-black/[0.04] bg-black/[0.015] p-3 text-sm text-muted md:grid-cols-2 lg:grid-cols-4">
                <p>Client : {client?.firstName} {client?.lastName}</p>
                <p>Téléphone : {client?.phone ?? 'Non renseigné'}</p>
                <p>Code postal : {client?.postalCode ?? 'Non renseigné'}</p>
                <p>Début : {project.startDate}</p>
              </div>

              <textarea
                value={project.internalNotes}
                onChange={(event) => updateProjectNote(project.id, event.target.value)}
                placeholder="Notes internes"
              />

              <div className="flex gap-2">
                <Button className="bg-zinc-900" onClick={() => setEditingProjectId(isEditing ? null : project.id)}>
                  {isEditing ? 'Terminer la modification' : 'Modifier'}
                </Button>
                <Button
                  className="border border-zinc-300 bg-zinc-100 text-zinc-800 shadow-none hover:bg-zinc-200"
                  onClick={() => deleteProject(project.id)}
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
