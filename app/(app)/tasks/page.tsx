'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tasks as initialTasks } from '@/lib/mock-data';
import { Task } from '@/lib/types';

export default function TasksPage() {
  const [taskItems, setTaskItems] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('moyenne');

  const createTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: `tsk_${crypto.randomUUID().slice(0, 8)}`,
      title: title.trim(),
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      status: 'todo',
      priority
    };

    setTaskItems((current) => [newTask, ...current]);
    setTitle('');
    setDueDate('');
    setPriority('moyenne');
  };

  const toggleStatus = (id: string) => {
    setTaskItems((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTaskItems((current) => current.filter((task) => task.id !== id));
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Tâches</h1>
        <p className="text-sm text-muted">Pilotage des urgences et échéances.</p>
      </div>
      <Card className="space-y-5">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="md:col-span-2"
            placeholder="Nouvelle tâche"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          <select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
            <option value="critique">Critique</option>
          </select>
          <Button onClick={createTask}>Créer</Button>
        </div>
        <ul className="space-y-2.5">
          {taskItems.map((task) => (
            <li key={task.id} className="premium-hover flex items-center justify-between rounded-xl border border-black/[0.05] px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted">Échéance {task.dueDate} · Statut {task.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={task.priority === 'critique' ? 'warning' : 'muted'}>{task.priority}</Badge>
                <Button className="px-3 py-1.5 text-xs" onClick={() => toggleStatus(task.id)}>
                  {task.status === 'done' ? 'Rouvrir' : 'Terminer'}
                </Button>
                <Button
                  className="border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-800 shadow-none hover:bg-zinc-200"
                  onClick={() => deleteTask(task.id)}
                >
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
