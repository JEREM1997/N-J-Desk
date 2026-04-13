'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Client, Project } from '@/lib/types';
import { listClients } from '@/lib/repositories/clients';
import { listProjects } from '@/lib/repositories/projects';

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [clientRows, projectRows] = await Promise.all([listClients(), listProjects()]);
      setClients(clientRows);
      setProjects(projectRows);
      setLoading(false);
    };

    void load();
  }, []);

  const client = useMemo(() => clients.find((entry) => entry.id === clientId), [clients, clientId]);
  const linkedProjects = useMemo(() => projects.filter((project) => project.clientId === clientId), [projects, clientId]);

  if (loading) {
    return (
      <section className="space-y-6 animate-fadeIn">
        <Card>
          <p className="text-sm text-muted">Chargement du client…</p>
        </Card>
      </section>
    );
  }

  if (!client) {
    return (
      <section className="space-y-6 animate-fadeIn">
        <Card>
          <h1 className="text-lg font-semibold">Client introuvable</h1>
          <p className="mt-1 text-sm text-muted">Ce client n&apos;existe pas ou n&apos;est plus disponible.</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {client.firstName} {client.lastName}
        </h1>
        <p className="text-sm text-muted">Fiche client détaillée.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <h2 className="text-sm font-semibold">Informations</h2>
          <p className="text-sm text-muted">Téléphone : {client.phone || 'Non renseigné'}</p>
          <p className="text-sm text-muted">Email : {client.email || 'Non renseigné'}</p>
          <p className="text-sm text-muted">Adresse : {client.address || 'Non renseignée'}</p>
          <p className="rounded-xl bg-black/[0.03] p-3 text-sm">Notes : {client.notes || 'Aucune note'}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold">Historique des échanges</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Appel de cadrage réalisé</li>
            <li>• Point d&apos;avancement partagé</li>
            <li>• Validation des matériaux</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold">Chantiers liés</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {linkedProjects.length === 0 ? (
            <li>Aucun chantier lié.</li>
          ) : (
            linkedProjects.map((project) => (
              <li key={project.id} className="rounded-xl border px-3 py-2">
                {project.title} — {project.status}
              </li>
            ))
          )}
        </ul>
      </Card>
    </section>
  );
}
