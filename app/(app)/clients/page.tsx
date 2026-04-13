'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client } from '@/lib/types';
import { createActivityLog } from '@/lib/repositories/activity-logs';
import { createClient, listClients } from '@/lib/repositories/clients';
import { listProjects } from '@/lib/repositories/projects';

const emptyClientDraft = {
  firstName: '',
  lastName: '',
  phone: '',
  postalCode: '',
  email: '',
  address: '',
  notes: ''
};

export default function ClientsPage() {
  const [clientItems, setClientItems] = useState<Client[]>([]);
  const [projectCountByClient, setProjectCountByClient] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(emptyClientDraft);

  const loadData = async () => {
    try {
      setError(null);
      const [clients, projects] = await Promise.all([listClients(), listProjects()]);
      setClientItems(clients);
      setProjectCountByClient(
        projects.reduce<Record<string, number>>((acc, project) => {
          acc[project.clientId] = (acc[project.clientId] ?? 0) + 1;
          return acc;
        }, {})
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clientItems;
    const query = search.toLowerCase().trim();
    return clientItems.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return fullName.includes(query) || client.email.toLowerCase().includes(query) || client.phone.includes(query);
    });
  }, [clientItems, search]);

  const handleCreateClient = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;

    try {
      const created = await createClient({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        phone: draft.phone.trim(),
        postalCode: draft.postalCode.trim(),
        email: draft.email.trim(),
        address: draft.address.trim(),
        notes: draft.notes.trim()
      });

      setClientItems((current) => [created, ...current]);
      await createActivityLog({
        actionType: 'client_created',
        message: `Nouveau client créé : ${created.firstName} ${created.lastName}.`,
        clientId: created.id
      });
      setDraft(emptyClientDraft);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Création impossible');
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="luxury-title">Clients</h1>
          <p className="text-sm text-muted">Recherche et suivi des relations clients.</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Rechercher un client" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button onClick={handleCreateClient}>Nouveau client</Button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold">Créer un client</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input placeholder="Prénom" value={draft.firstName} onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))} />
          <input placeholder="Nom" value={draft.lastName} onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))} />
          <input placeholder="Téléphone" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
          <input placeholder="Email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
          <input placeholder="Code postal" value={draft.postalCode} onChange={(event) => setDraft((current) => ({ ...current, postalCode: event.target.value }))} />
          <input placeholder="Adresse" value={draft.address} onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))} />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <p className="px-4 py-4 text-sm text-muted">Chargement des clients…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Chantiers liés</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-black/[0.04] transition-colors hover:bg-black/[0.02]">
                  <td className="px-4 py-3.5 font-medium">
                    <Link className="hover:underline" href={`/clients/${client.id}`}>
                      {client.firstName} {client.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-muted">{client.email || 'Non renseigné'}</td>
                  <td className="px-4 py-3.5 text-muted">{client.phone || 'Non renseigné'}</td>
                  <td className="px-4 py-3.5">{projectCountByClient[client.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
