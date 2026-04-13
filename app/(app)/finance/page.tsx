'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listProjects } from '@/lib/repositories/projects';
import { Project } from '@/lib/types';

function chf(value: number) {
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(value || 0);
}

export default function FinancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const rows = await listProjects();
      setProjects(rows);
      setLoading(false);
    };

    void load();
  }, []);

  const totalQuote = projects.reduce((sum, project) => sum + project.quoteAmount, 0);
  const totalBilled = projects.reduce((sum, project) => sum + project.billedAmount, 0);
  const totalCollected = projects.reduce((sum, project) => sum + project.balanceReceived, 0);
  const totalRemaining = Math.max(totalQuote - totalCollected, 0);

  return (
    <section className="page-wrap">
      <div>
        <h1 className="luxury-title">Finances</h1>
        <p className="text-sm text-muted">Pilotage global devis, facturation et encaissements.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-xs text-muted">Total devis</p><p className="mt-1 text-2xl font-semibold">{chf(totalQuote)}</p></Card>
        <Card><p className="text-xs text-muted">Total facturé</p><p className="mt-1 text-2xl font-semibold">{chf(totalBilled)}</p></Card>
        <Card><p className="text-xs text-muted">Total encaissé</p><p className="mt-1 text-2xl font-semibold">{chf(totalCollected)}</p></Card>
        <Card><p className="text-xs text-muted">Reste à encaisser</p><p className="mt-1 text-2xl font-semibold text-rose-700">{chf(totalRemaining)}</p></Card>
      </div>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-2 p-2 md:hidden">
              {projects.map((project) => {
                const remaining = Math.max(project.quoteAmount - project.balanceReceived, 0);
                return (
                  <div key={project.id} className="rounded-xl border border-black/[0.06] bg-white p-3 text-sm">
                    <p className="font-semibold">{project.title}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted">
                      <p>Devis</p><p className="text-right text-foreground">{chf(project.quoteAmount)}</p>
                      <p>Facturé</p><p className="text-right text-foreground">{chf(project.billedAmount)}</p>
                      <p>Encaissé</p><p className="text-right text-foreground">{chf(project.balanceReceived)}</p>
                      <p>Reste</p><p className="text-right font-semibold text-rose-700">{chf(remaining)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <table className="hidden w-full text-sm md:table">
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
          </>
        )}
      </Card>
    </section>
  );
}
