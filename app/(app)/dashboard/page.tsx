import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityLogs, projects, tasks } from '@/lib/mock-data';

const kpis = [
  { label: 'Prospects', value: '14' },
  { label: 'Devis en attente', value: '6' },
  { label: 'Chantiers en cours', value: projects.filter((p) => p.status === 'en_cours').length.toString() },
  { label: 'Chantiers terminés', value: '22' },
  { label: 'Paiements à relancer', value: '3' }
];

export default function DashboardPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted">Vision claire des activités N&J Intérieurs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="space-y-1">
            <p className="text-xs text-muted">{kpi.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold">Activité récente</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {activityLogs.map((log) => (
              <li key={log} className="rounded-xl bg-black/[0.02] px-3 py-2">
                {log}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Tâches prioritaires</h2>
          <ul className="mt-4 space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
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
