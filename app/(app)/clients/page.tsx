'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Client } from '@/lib/types';
import { createActivityLog } from '@/lib/repositories/activity-logs';
import { createClient, deleteClient, listClients } from '@/lib/repositories/clients';
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

  const handleDeleteClient = async (client: Client) => {
    try {
      await deleteClient(client.id);
      setClientItems((current) => current.filter((entry) => entry.id !== client.id));
      await createActivityLog({
        actionType: 'client_deleted',
        message: `Client supprimé : ${client.firstName} ${client.lastName}.`,
        clientId: client.id
      });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Suppression impossible');
    }
  };

  return (
    <section className="page-wrap">
      <div className="page-head">
        <div>
          <h1 className="luxury-title">Clients</h1>
          <p className="text-sm text-muted">Recherche et suivi des relations clients.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input className="w-full sm:w-64" placeholder="Rechercher un client" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button onClick={handleCreateClient}>Nouveau client</Button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <Card className="space-y-3 p-4 sm:p-5">
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
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <ul className="space-y-2 p-2.5">
                {filteredClients.map((client) => (
                  <li key={client.id} className="rounded-2xl border border-black/[0.06] bg-white p-3.5 text-sm shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]">
                    <Link className="font-semibold hover:underline" href={`/clients/${client.id}`}>
                      {client.firstName} {client.lastName}
                    </Link>
                    <p className="mt-1 text-xs text-muted">{client.email || 'Email non renseigné'}</p>
                    <p className="text-xs text-muted">{client.phone || 'Téléphone non renseigné'}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-muted">Chantiers liés : {projectCountByClient[client.id] ?? 0}</p>
                      <Button size="sm" variant="destructive" onClick={() => void handleDeleteClient(client)}>
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <table className="data-table hidden md:table">
              <thead className="table-head">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Chantiers liés</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td className="font-medium">
                      <Link className="hover:underline" href={`/clients/${client.id}`}>
                        {client.firstName} {client.lastName}
                      </Link>
                    </td>
                    <td className="text-muted">{client.email || 'Non renseigné'}</td>
                    <td className="text-muted">{client.phone || 'Non renseigné'}</td>
                    <td>{projectCountByClient[client.id] ?? 0}</td>
                    <td className="text-right">
                      <Button size="sm" variant="destructive" onClick={() => void handleDeleteClient(client)}>
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </section>
  );
}
