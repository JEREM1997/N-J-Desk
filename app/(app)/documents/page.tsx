'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listProjects } from '@/lib/repositories/projects';
import { createDocumentWithFile, createPhotoWithFile, listDocuments, listPhotos } from '@/lib/repositories/documents';
import { ProjectDocument, ProjectPhoto, Project } from '@/lib/types';

export default function DocumentsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [documentDraft, setDocumentDraft] = useState({ file: null as File | null, category: 'autre' as ProjectDocument['category'], projectId: '' });
  const [photoDraft, setPhotoDraft] = useState({ file: null as File | null, caption: '', phase: 'avant' as ProjectPhoto['phase'], projectId: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [projectRows, documentRows, photoRows] = await Promise.all([listProjects(), listDocuments(), listPhotos()]);
        setProjects(projectRows);
        setDocuments(documentRows);
        setPhotos(photoRows);
        setDocumentDraft((current) => ({ ...current, projectId: current.projectId || projectRows[0]?.id || '' }));
        setPhotoDraft((current) => ({ ...current, projectId: current.projectId || projectRows[0]?.id || '' }));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement');
      }
    };

    void load();
  }, []);

  const handleCreateDocument = async () => {
    if (!documentDraft.file || !documentDraft.projectId) return;

    try {
      const created = await createDocumentWithFile({
        file: documentDraft.file,
        category: documentDraft.category,
        projectId: documentDraft.projectId
      });

      setDocuments((current) => [created, ...current]);
      setDocumentDraft((current) => ({ ...current, file: null }));
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Ajout document impossible');
    }
  };

  const handleCreatePhoto = async () => {
    if (!photoDraft.file || !photoDraft.projectId) return;

    try {
      const created = await createPhotoWithFile({
        file: photoDraft.file,
        phase: photoDraft.phase,
        caption: photoDraft.caption.trim(),
        projectId: photoDraft.projectId
      });

      setPhotos((current) => [created, ...current]);
      setPhotoDraft((current) => ({ ...current, file: null, caption: '' }));
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Ajout photo impossible');
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Documents & Photos</h1>
        <p className="text-sm text-muted">Centralisation des pièces chantier et suivi visuel avant/après.</p>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-sm font-semibold">Ajouter un document</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input type="file" onChange={(event) => setDocumentDraft((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} />
            <select value={documentDraft.category} onChange={(event) => setDocumentDraft((current) => ({ ...current, category: event.target.value as ProjectDocument['category'] }))}>
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
              <option value="plan">Plan</option>
              <option value="contrat">Contrat</option>
              <option value="autre">Autre</option>
            </select>
            <select className="md:col-span-2" value={documentDraft.projectId} onChange={(event) => setDocumentDraft((current) => ({ ...current, projectId: event.target.value }))}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => void handleCreateDocument()}>Téléverser document</Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold">Ajouter une photo chantier</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input type="file" accept="image/*" onChange={(event) => setPhotoDraft((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} />
            <select value={photoDraft.phase} onChange={(event) => setPhotoDraft((current) => ({ ...current, phase: event.target.value as ProjectPhoto['phase'] }))}>
              <option value="avant">Avant</option>
              <option value="apres">Après</option>
            </select>
            <input placeholder="Légende" value={photoDraft.caption} onChange={(event) => setPhotoDraft((current) => ({ ...current, caption: event.target.value }))} />
            <select value={photoDraft.projectId} onChange={(event) => setPhotoDraft((current) => ({ ...current, projectId: event.target.value }))}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => void handleCreatePhoto()}>Téléverser photo</Button>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold">Derniers documents</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {documents.slice(0, 8).map((document) => (
              <li key={document.id} className="rounded-xl border px-3 py-2">
                {document.fileName} · {document.category} · {document.uploadedAt}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Dernières photos</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {photos.slice(0, 8).map((photo) => (
              <li key={photo.id} className="rounded-xl border px-3 py-2">
                {photo.phase.toUpperCase()} · {photo.caption || 'Photo chantier'} · {photo.uploadedAt}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
