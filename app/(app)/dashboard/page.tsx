'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStoredActivityLogs, getStoredProjects, getStoredTasks } from '@/lib/data-store';
import { usePersistentState } from '@/lib/use-persistent-state';

export default function DashboardPage() {
  const { value: projects } = usePersistentState(getStoredProjects);
  const { value: tasks } = usePersistentState(getStoredTasks);
  const { value: activityLogs } = usePersistentState(getStoredActivityLogs);

  const kpis = [
    { label: 'Prospects', value: projects.filter((project) => project.status === 'prospect').length.toString() },
    { label: 'Devis en attente', value: projects.filter((project) => project.status === 'devis_envoye').length.toString() },
    { label: 'Chantiers en cours', value: projects.filter((project) => project.status === 'en_cours').length.toString() },
    { label: 'Chantiers terminés', value: projects.filter((project) => project.status === 'termine').length.toString() },
    { label: 'Paiements à relancer', value: projects.filter((project) => project.balanceReceived < project.quoteAmount).length.toString() }
  ];

  return (
    <section className="space-y-7 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">N&J Desk</p>
          <h1 className="luxury-title">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted">Vision claire et premium des activités N&J Intérieurs.</p>
        </div>
        <div className="hidden rounded-xl border bg-white/80 px-4 py-2 text-xs font-medium text-muted shadow-sm lg:block">
          Vue synchronisée localement
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="premium-hover space-y-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted">{kpi.label}</p>
            <p className="text-3xl font-semibold tracking-tight">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="subtle-divider pb-3">
            <h2 className="text-sm font-semibold">Activité récente</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {activityLogs.slice(0, 8).map((log) => (
              <li key={log} className="premium-hover rounded-xl border border-black/[0.04] bg-black/[0.02] px-3 py-2.5">
                {log}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="subtle-divider pb-3">
            <h2 className="text-sm font-semibold">Tâches prioritaires</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {tasks.slice(0, 8).map((task) => (
              <li key={task.id} className="premium-hover flex items-center justify-between rounded-xl border border-black/[0.05] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted">Échéance {task.dueDate}</p>
                </div>
                <Badge tone={task.priority === 'critique' ? 'warning' : 'muted'}>{task.priority}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
