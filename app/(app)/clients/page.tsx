import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { clients, projects } from '@/lib/mock-data';

export default function ClientsPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted">Recherche et suivi des relations clients.</p>
        </div>
        <div className="flex gap-2">
          <input className="rounded-xl border bg-white px-3 py-2 text-sm" placeholder="Rechercher un client" />
          <select className="rounded-xl border bg-white px-3 py-2 text-sm">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>Prospect</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03] text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Chantiers liés</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t hover:bg-black/[0.015]">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/clients/${client.id}`} className="hover:underline">
                    {client.firstName} {client.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{client.email}</td>
                <td className="px-4 py-3 text-muted">{client.phone}</td>
                <td className="px-4 py-3">{projects.filter((project) => project.clientId === client.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
