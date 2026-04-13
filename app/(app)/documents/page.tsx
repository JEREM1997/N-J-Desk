'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  appendActivityLog,
  getStoredDocuments,
  getStoredPhotos,
  getStoredProjects,
  setStoredDocuments,
  setStoredPhotos
} from '@/lib/data-store';
import type { ProjectDocument, ProjectPhoto } from '@/lib/types';
import { usePersistentState } from '@/lib/use-persistent-state';

export default function DocumentsPage() {
  const { value: projects } = usePersistentState(getStoredProjects);
  const { value: documents, setValue: setDocuments } = usePersistentState(getStoredDocuments, setStoredDocuments);
  const { value: photos, setValue: setPhotos } = usePersistentState(getStoredPhotos, setStoredPhotos);

  const [documentDraft, setDocumentDraft] = useState({ fileName: '', category: 'autre' as ProjectDocument['category'], projectId: projects[0]?.id ?? '' });
  const [photoDraft, setPhotoDraft] = useState({ caption: '', phase: 'avant' as ProjectPhoto['phase'], projectId: projects[0]?.id ?? '' });

  const createDocument = () => {
    if (!documentDraft.fileName.trim() || !documentDraft.projectId) return;
    const document: ProjectDocument = {
      id: `doc_${crypto.randomUUID().slice(0, 8)}`,
      fileName: documentDraft.fileName.trim(),
      category: documentDraft.category,
      projectId: documentDraft.projectId,
      uploadedAt: new Date().toISOString().slice(0, 10)
    };
    setDocuments((current) => [document, ...current]);
    appendActivityLog(`Document ajouté : ${document.fileName}.`);
    setDocumentDraft((current) => ({ ...current, fileName: '' }));
  };

  const createPhoto = () => {
    if (!photoDraft.projectId) return;
    const photo: ProjectPhoto = {
      id: `pho_${crypto.randomUUID().slice(0, 8)}`,
      projectId: photoDraft.projectId,
      phase: photoDraft.phase,
      caption: photoDraft.caption.trim() || 'Photo chantier',
      uploadedAt: new Date().toISOString().slice(0, 10)
    };
    setPhotos((current) => [photo, ...current]);
    appendActivityLog(`Photo ${photo.phase} ajoutée sur chantier.`);
    setPhotoDraft((current) => ({ ...current, caption: '' }));
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Documents & Photos</h1>
        <p className="text-sm text-muted">Centralisation des pièces chantier et suivi visuel avant/après.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-sm font-semibold">Ajouter un document</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              placeholder="Nom du fichier"
              value={documentDraft.fileName}
              onChange={(event) => setDocumentDraft((current) => ({ ...current, fileName: event.target.value }))}
            />
            <select
              value={documentDraft.category}
              onChange={(event) => setDocumentDraft((current) => ({ ...current, category: event.target.value as ProjectDocument['category'] }))}
            >
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
              <option value="plan">Plan</option>
              <option value="contrat">Contrat</option>
              <option value="autre">Autre</option>
            </select>
            <select
              className="md:col-span-2"
              value={documentDraft.projectId}
              onChange={(event) => setDocumentDraft((current) => ({ ...current, projectId: event.target.value }))}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={createDocument}>Ajouter document</Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold">Ajouter une photo chantier</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              placeholder="Légende"
              value={photoDraft.caption}
              onChange={(event) => setPhotoDraft((current) => ({ ...current, caption: event.target.value }))}
            />
            <select
              value={photoDraft.phase}
              onChange={(event) => setPhotoDraft((current) => ({ ...current, phase: event.target.value as ProjectPhoto['phase'] }))}
            >
              <option value="avant">Avant</option>
              <option value="apres">Après</option>
            </select>
            <select
              className="md:col-span-2"
              value={photoDraft.projectId}
              onChange={(event) => setPhotoDraft((current) => ({ ...current, projectId: event.target.value }))}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={createPhoto}>Ajouter photo</Button>
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
                {photo.phase.toUpperCase()} · {photo.caption} · {photo.uploadedAt}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
