import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { tasks } from '@/lib/mock-data';

export default function TasksPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tâches</h1>
        <p className="text-sm text-muted">Pilotage des urgences et échéances.</p>
      </div>
      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <input className="rounded-xl border bg-white px-3 py-2 text-sm md:col-span-2" placeholder="Nouvelle tâche" />
          <input className="rounded-xl border bg-white px-3 py-2 text-sm" type="date" />
          <select className="rounded-xl border bg-white px-3 py-2 text-sm">
            <option>Priorité</option>
            <option>Critique</option>
            <option>Haute</option>
          </select>
          <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">Créer</button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted">Échéance {task.dueDate} · Statut {task.status}</p>
              </div>
              <Badge tone={task.priority === 'critique' ? 'warning' : 'muted'}>{task.priority}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
