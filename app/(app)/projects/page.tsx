import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { clients, projects } from '@/lib/mock-data';

const statusLabel = {
  prospect: 'Prospect',
  devis_envoye: 'Devis envoyé',
  devis_accepte: 'Devis accepté',
  planifie: 'Planifié',
  en_cours: 'En cours',
  termine: 'Terminé',
  sav: 'SAV'
};

export default function ProjectsPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="luxury-title">Chantiers</h1>
          <p className="text-sm text-muted">Suivi opérationnel et financier de vos dossiers.</p>
        </div>
        <Button>Nouveau chantier</Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => {
          const client = clients.find((entry) => entry.id === project.clientId);
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
                <p>Début : {project.startDate}</p>
                <p>Fin estimée : {project.estimatedEndDate}</p>
                <p>Devis : {project.quoteAmount.toLocaleString('fr-FR')} €</p>
                <p>Facturé : {project.billedAmount.toLocaleString('fr-FR')} €</p>
                <p>Acompte reçu : {project.depositReceived.toLocaleString('fr-FR')} €</p>
                <p>Solde reçu : {project.balanceReceived.toLocaleString('fr-FR')} €</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="bg-black/[0.015] shadow-none">
                  <h3 className="text-sm font-semibold">Tâches associées</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    <li>• Commande matériaux</li>
                    <li>• Validation planning équipe</li>
                  </ul>
                </Card>
                <Card className="bg-black/[0.015] shadow-none">
                  <h3 className="text-sm font-semibold">Documents</h3>
                  <p className="mt-2 text-sm text-muted">Upload prêt pour Supabase Storage.</p>
                  <input type="file" className="mt-2 block w-full text-xs" />
                </Card>
                <Card className="bg-black/[0.015] shadow-none">
                  <h3 className="text-sm font-semibold">Photos avant / après</h3>
                  <p className="mt-2 text-sm text-muted">Ajoutez les photos du chantier.</p>
                  <input type="file" multiple className="mt-2 block w-full text-xs" />
                </Card>
              </div>

              <textarea defaultValue={project.internalNotes} />

              <div className="flex gap-2">
                <Button className="bg-zinc-900">Modifier</Button>
                <Button className="border border-zinc-300 bg-zinc-100 text-zinc-800 shadow-none hover:bg-zinc-200">Supprimer</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
