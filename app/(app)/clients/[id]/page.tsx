import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { clients, projects } from '@/lib/mock-data';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = clients.find((entry) => entry.id === params.id);
  if (!client) notFound();

  const linkedProjects = projects.filter((project) => project.clientId === client.id);

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {client.firstName} {client.lastName}
        </h1>
        <p className="text-sm text-muted">Fiche client détaillée.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold">Informations</h2>
          <p className="text-sm text-muted">Téléphone : {client.phone}</p>
          <p className="text-sm text-muted">Email : {client.email}</p>
          <p className="text-sm text-muted">Adresse : {client.address}</p>
          <p className="rounded-xl bg-black/[0.03] p-3 text-sm">Notes : {client.notes}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold">Historique des échanges</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Appel de cadrage réalisé le 04/04/2026</li>
            <li>• Envoi moodboard le 06/04/2026</li>
            <li>• Validation des matériaux le 09/04/2026</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold">Chantiers liés</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {linkedProjects.map((project) => (
            <li key={project.id} className="rounded-xl border px-3 py-2">
              {project.title} — {project.status}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
