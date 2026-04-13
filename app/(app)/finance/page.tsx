'use client';

import { Card } from '@/components/ui/card';
import { getStoredProjects } from '@/lib/data-store';
import { usePersistentState } from '@/lib/use-persistent-state';

function chf(value: number) {
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(value || 0);
}

export default function FinancePage() {
  const { value: projects, hydrated } = usePersistentState(getStoredProjects);

  const totalQuote = projects.reduce((sum, project) => sum + project.quoteAmount, 0);
  const totalBilled = projects.reduce((sum, project) => sum + project.billedAmount, 0);
  const totalCollected = projects.reduce((sum, project) => sum + project.balanceReceived, 0);
  const totalRemaining = Math.max(totalQuote - totalCollected, 0);

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Finances</h1>
        <p className="text-sm text-muted">Pilotage global devis, facturation et encaissements.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-muted">Total devis</p><p className="mt-1 text-2xl font-semibold">{chf(totalQuote)}</p></Card>
        <Card><p className="text-xs text-muted">Total facturé</p><p className="mt-1 text-2xl font-semibold">{chf(totalBilled)}</p></Card>
        <Card><p className="text-xs text-muted">Total encaissé</p><p className="mt-1 text-2xl font-semibold">{chf(totalCollected)}</p></Card>
        <Card><p className="text-xs text-muted">Reste à encaisser</p><p className="mt-1 text-2xl font-semibold text-rose-700">{chf(totalRemaining)}</p></Card>
      </div>

      <Card className="overflow-hidden p-0">
        {!hydrated ? (
          <p className="px-4 py-4 text-sm text-muted">Chargement des données financières…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Chantier</th>
                <th className="px-4 py-3">Devis</th>
                <th className="px-4 py-3">Facturé</th>
                <th className="px-4 py-3">Encaissé</th>
                <th className="px-4 py-3">Reste</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const remaining = Math.max(project.quoteAmount - project.balanceReceived, 0);
                return (
                  <tr key={project.id} className="border-t border-black/[0.04]">
                    <td className="px-4 py-3.5 font-medium">{project.title}</td>
                    <td className="px-4 py-3.5">{chf(project.quoteAmount)}</td>
                    <td className="px-4 py-3.5">{chf(project.billedAmount)}</td>
                    <td className="px-4 py-3.5">{chf(project.balanceReceived)}</td>
                    <td className="px-4 py-3.5 font-semibold text-rose-700">{chf(remaining)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
