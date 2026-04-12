import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tasks } from '@/lib/mock-data';

export default function TasksPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Tâches</h1>
        <p className="text-sm text-muted">Pilotage des urgences et échéances.</p>
      </div>
      <Card className="space-y-5">
        <div className="grid gap-3 md:grid-cols-5">
          <input className="md:col-span-2" placeholder="Nouvelle tâche" />
          <input type="date" />
          <select>
            <option>Priorité</option>
            <option>Critique</option>
            <option>Haute</option>
          </select>
          <Button>Créer</Button>
        </div>
        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li key={task.id} className="premium-hover flex items-center justify-between rounded-xl border border-black/[0.05] px-3 py-2.5">
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
