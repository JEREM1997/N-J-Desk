'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import {
  appendActivityLog,
  getStoredClients,
  getStoredProjects,
  getStoredTasks,
  setStoredTasks
} from '@/lib/data-store';
import { usePersistentState } from '@/lib/use-persistent-state';

export default function TasksPage() {
  const { value: taskItems, setValue: setTaskItems, hydrated } = usePersistentState(getStoredTasks, setStoredTasks);
  const { value: clients } = usePersistentState(getStoredClients, () => undefined);
  const { value: projects } = usePersistentState(getStoredProjects, () => undefined);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('moyenne');
  const [projectId, setProjectId] = useState('');

  const createTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: `tsk_${crypto.randomUUID().slice(0, 8)}`,
      title: title.trim(),
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      status: 'todo',
      priority,
      projectId: projectId || undefined
    };

    setTaskItems((current) => [newTask, ...current]);
    appendActivityLog(`Nouvelle tâche : ${newTask.title}.`);
    setTitle('');
    setDueDate('');
    setPriority('moyenne');
    setProjectId('');
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
    const task = taskItems.find((entry) => entry.id === id);
    setTaskItems((current) => current.filter((entry) => entry.id !== id));
    if (task) appendActivityLog(`Tâche supprimée : ${task.title}.`);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Tâches</h1>
        <p className="text-sm text-muted">Pilotage des urgences et échéances.</p>
      </div>
      <Card className="space-y-5">
        <div className="grid gap-3 md:grid-cols-6">
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
          <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
            <option value="">Sans chantier</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <Button onClick={createTask}>Créer</Button>
        </div>
        {!hydrated ? (
          <p className="text-sm text-muted">Chargement des tâches…</p>
        ) : (
          <ul className="space-y-2.5">
            {taskItems.map((task) => {
              const project = projects.find((entry) => entry.id === task.projectId);
              const client = clients.find((entry) => entry.id === task.clientId);

              return (
                <li key={task.id} className="premium-hover flex items-center justify-between rounded-xl border border-black/[0.05] px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted">
                      Échéance {task.dueDate} · Statut {task.status}
                      {project ? ` · Chantier ${project.title}` : ''}
                      {client ? ` · Client ${client.firstName} ${client.lastName}` : ''}
                    </p>
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
              );
            })}
          </ul>
        )}
      </Card>
    </section>
  );
}
