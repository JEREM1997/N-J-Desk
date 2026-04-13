'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, ProjectStatus, Client, ProjectDocument, ProjectPhoto } from '@/lib/types';
import { createActivityLog } from '@/lib/repositories/activity-logs';
import { listClients } from '@/lib/repositories/clients';
import { listDocuments, listPhotos } from '@/lib/repositories/documents';
import { createProject, deleteProject, listProjects, updateProject } from '@/lib/repositories/projects';

const statusLabel: Record<ProjectStatus, string> = {
  prospect: 'Prospect',
  devis_envoye: 'Devis envoyé',
  devis_accepte: 'Devis accepté',
  planifie: 'Planifié',
  en_cours: 'En cours',
  termine: 'Terminé',
  sav: 'SAV'
};

const formatProjectCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(value || 0);
};

export default function ProjectsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projectItems, setProjectItems] = useState<Project[]>([]);
  const [documentItems, setDocumentItems] = useState<ProjectDocument[]>([]);
  const [photoItems, setPhotoItems] = useState<ProjectPhoto[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: '',
    address: '',
    clientId: '',
    status: 'prospect' as ProjectStatus
  });

  const loadData = async () => {
    try {
      setError(null);
      const [clientRows, projectRows, documents, photos] = await Promise.all([listClients(), listProjects(), listDocuments(), listPhotos()]);
      setClients(clientRows);
      setProjectItems(projectRows);
      setDocumentItems(documents);
      setPhotoItems(photos);
      setDraft((current) => ({ ...current, clientId: current.clientId || clientRows[0]?.id || '' }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const sortedProjects = useMemo(
    () => [...projectItems].sort((a, b) => a.startDate.localeCompare(b.startDate) * -1),
    [projectItems]
  );

  const handleCreateProject = async () => {
    if (!draft.title.trim() || !draft.address.trim() || !draft.clientId) return;
    const selectedClient = clients.find((entry) => entry.id === draft.clientId);
    const normalizedSiteAddress = draft.address.trim().toLowerCase();
    const normalizedClientAddress = selectedClient?.address.trim().toLowerCase() ?? '';

    if (selectedClient && normalizedClientAddress && normalizedSiteAddress === normalizedClientAddress) {
      setError('L’adresse du chantier doit être différente de l’adresse client.');
      return;
    }

    try {
      setError(null);
      const created = await createProject({
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
      });

      setProjectItems((current) => [created, ...current]);
      await createActivityLog({ actionType: 'project_created', message: `Chantier créé : ${created.title}.`, projectId: created.id });
      setDraft((current) => ({ ...current, title: '', address: '' }));
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Création impossible');
    }
  };

  const handleDeleteProject = async (id: string) => {
    const project = projectItems.find((entry) => entry.id === id);

    try {
      await deleteProject(id);
      setProjectItems((current) => current.filter((entry) => entry.id !== id));
      if (project) {
        await createActivityLog({ actionType: 'project_deleted', message: `Chantier supprimé : ${project.title}.`, projectId: id });
      }
      if (editingProjectId === id) setEditingProjectId(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Suppression impossible');
    }
  };

  const handleProjectFieldChange = async <K extends keyof Project>(id: string, field: K, value: Project[K]) => {
    setError(null);
    setProjectItems((current) => current.map((project) => (project.id === id ? { ...project, [field]: value } : project)));

    try {
      const updated = await updateProject(id, { [field]: value } as Partial<Omit<Project, 'id'>>);
      setProjectItems((current) => current.map((project) => (project.id === id ? updated : project)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Modification impossible');
      await loadData();
    }
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
          <Button onClick={handleCreateProject}>Nouveau chantier</Button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <Card>
          <p className="text-sm text-muted">Chargement des chantiers…</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedProjects.map((project) => {
            const client = clients.find((entry) => entry.id === project.clientId);
            const isEditing = editingProjectId === project.id;
            const remainingToBill = Math.max(project.quoteAmount - project.billedAmount, 0);
            const remainingToCollect = Math.max(project.quoteAmount - project.balanceReceived, 0);
            const projectDocuments = documentItems.filter((entry) => entry.projectId === project.id);
            const projectPhotos = photoItems.filter((entry) => entry.projectId === project.id);

            return (
              <Card key={project.id} className="space-y-4 premium-hover">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{project.title}</h2>
                    <p className="text-sm text-muted">{project.address}</p>
                  </div>
                  <Badge tone={project.status === 'en_cours' ? 'success' : 'default'}>{statusLabel[project.status]}</Badge>
                </div>

                <div className="grid gap-3 rounded-xl border border-black/[0.04] bg-black/[0.015] p-3 text-sm text-muted md:grid-cols-2 lg:grid-cols-4">
                  <p>Client : {client?.firstName} {client?.lastName}</p>
                  <p>Téléphone : {client?.phone ?? 'Non renseigné'}</p>
                  <p>Code postal : {client?.postalCode ?? 'Non renseigné'}</p>
                  <p>Adresse client : {client?.address || 'Non renseigné'}</p>
                  <p>Début : {project.startDate}</p>
                </div>

                <div className="grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm md:grid-cols-2 lg:grid-cols-3">
                  <p>Montant devis : <span className="font-semibold text-foreground">{formatProjectCurrency(project.quoteAmount)}</span></p>
                  <p>Montant facturé : <span className="font-semibold text-foreground">{formatProjectCurrency(project.billedAmount)}</span></p>
                  <p>Acompte encaissé : <span className="font-semibold text-foreground">{formatProjectCurrency(project.depositReceived)}</span></p>
                  <p>Solde encaissé : <span className="font-semibold text-foreground">{formatProjectCurrency(project.balanceReceived)}</span></p>
                  <p>Reste à facturer : <span className="font-semibold text-amber-700">{formatProjectCurrency(remainingToBill)}</span></p>
                  <p>Reste à encaisser : <span className="font-semibold text-rose-700">{formatProjectCurrency(remainingToCollect)}</span></p>
                </div>

                <div className="grid gap-3 rounded-xl border border-black/[0.06] bg-white p-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Documents du chantier</p>
                    {projectDocuments.length === 0 ? (
                      <p className="text-xs text-muted">Aucun document lié.</p>
                    ) : (
                      <ul className="space-y-1">
                        {projectDocuments.slice(0, 4).map((document) => (
                          <li key={document.id}>
                            {document.fileUrl ? (
                              <a className="text-xs text-blue-700 underline" href={document.fileUrl} target="_blank" rel="noreferrer">
                                {document.fileName}
                              </a>
                            ) : (
                              <span className="text-xs text-muted">{document.fileName}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Photos du chantier</p>
                    {projectPhotos.length === 0 ? (
                      <p className="text-xs text-muted">Aucune photo liée.</p>
                    ) : (
                      <ul className="space-y-1">
                        {projectPhotos.slice(0, 4).map((photo) => (
                          <li key={photo.id}>
                            {photo.fileUrl ? (
                              <a className="text-xs text-blue-700 underline" href={photo.fileUrl} target="_blank" rel="noreferrer">
                                {photo.caption || photo.phase.toUpperCase()}
                              </a>
                            ) : (
                              <span className="text-xs text-muted">{photo.caption || photo.phase.toUpperCase()}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="grid gap-2 rounded-xl border border-black/[0.06] bg-white p-3 md:grid-cols-2 lg:grid-cols-3">
                    <input type="number" min={0} value={project.quoteAmount} onChange={(event) => void handleProjectFieldChange(project.id, 'quoteAmount', Number(event.target.value) || 0)} placeholder="Montant devis" />
                    <input type="number" min={0} value={project.billedAmount} onChange={(event) => void handleProjectFieldChange(project.id, 'billedAmount', Number(event.target.value) || 0)} placeholder="Montant facturé" />
                    <input type="number" min={0} value={project.depositReceived} onChange={(event) => void handleProjectFieldChange(project.id, 'depositReceived', Number(event.target.value) || 0)} placeholder="Acompte encaissé" />
                    <input type="number" min={0} value={project.balanceReceived} onChange={(event) => void handleProjectFieldChange(project.id, 'balanceReceived', Number(event.target.value) || 0)} placeholder="Solde encaissé" />
                    <input type="date" value={project.startDate} onChange={(event) => void handleProjectFieldChange(project.id, 'startDate', event.target.value)} />
                    <input type="date" value={project.estimatedEndDate} onChange={(event) => void handleProjectFieldChange(project.id, 'estimatedEndDate', event.target.value)} />
                    <select value={project.status} onChange={(event) => void handleProjectFieldChange(project.id, 'status', event.target.value as ProjectStatus)}>
                      {Object.entries(statusLabel).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {project.balanceReceived > project.quoteAmount && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Attention : les encaissements dépassent le montant devis.
                  </p>
                )}

                {isEditing ? (
                  <textarea
                    value={project.internalNotes}
                    onChange={(event) => void handleProjectFieldChange(project.id, 'internalNotes', event.target.value)}
                    placeholder="Notes internes"
                  />
                ) : (
                  <p className="rounded-xl border border-black/[0.06] bg-white p-3 text-sm text-muted">
                    {project.internalNotes?.trim() || 'Aucune note interne'}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button className="bg-zinc-900" onClick={() => setEditingProjectId(isEditing ? null : project.id)}>
                    {isEditing ? 'Terminer la modification' : 'Modifier'}
                  </Button>
                  <Button className="border border-zinc-300 bg-zinc-100 text-zinc-800 shadow-none hover:bg-zinc-200" onClick={() => void handleDeleteProject(project.id)}>
                    Supprimer
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
