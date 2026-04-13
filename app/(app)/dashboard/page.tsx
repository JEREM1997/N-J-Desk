'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listActivityLogs } from '@/lib/repositories/activity-logs';
import { listProjects } from '@/lib/repositories/projects';
import { listTasks } from '@/lib/repositories/tasks';
import { Project, Task } from '@/lib/types';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLogs, setActivityLogs] = useState<{ id: string; message: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [projectRows, taskRows, logs] = await Promise.all([listProjects(), listTasks(), listActivityLogs(8)]);
      setProjects(projectRows);
      setTasks(taskRows);
      setActivityLogs(logs.map((log) => ({ id: log.id, message: log.message })));
    };

    void load();
  }, []);

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
          Vue synchronisée Supabase
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
            {activityLogs.map((log) => (
              <li key={log.id} className="premium-hover rounded-xl border border-black/[0.04] bg-black/[0.02] px-3 py-2.5">
                {log.message}
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
