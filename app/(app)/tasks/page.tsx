'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task, Client, Project } from '@/lib/types';
import { createActivityLog } from '@/lib/repositories/activity-logs';
import { listClients } from '@/lib/repositories/clients';
import { listProjects } from '@/lib/repositories/projects';
import { createTask, deleteTask, listTasks, updateTask } from '@/lib/repositories/tasks';

const taskStatusLabel: Record<Task['status'], string> = {
  todo: 'À faire',
  en_cours: 'En cours',
  done: 'Terminée'
};

export default function TasksPage() {
  const [taskItems, setTaskItems] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('moyenne');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [tasks, clientRows, projectRows] = await Promise.all([listTasks(), listClients(), listProjects()]);
      setTaskItems(tasks);
      setClients(clientRows);
      setProjects(projectRows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreateTask = async () => {
    if (!title.trim()) return;

    try {
      const created = await createTask({
        title: title.trim(),
        dueDate: dueDate || new Date().toISOString().slice(0, 10),
        status: 'todo',
        priority,
        projectId: projectId || undefined
      });

      setTaskItems((current) => [created, ...current]);
      await createActivityLog({ actionType: 'task_created', message: `Nouvelle tâche : ${created.title}.`, projectId: created.projectId });
      setTitle('');
      setDueDate('');
      setPriority('moyenne');
      setProjectId('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Création impossible');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    setTaskItems((current) => current.map((entry) => (entry.id === task.id ? { ...entry, status: nextStatus } : entry)));

    try {
      const updated = await updateTask(task.id, { status: nextStatus });
      setTaskItems((current) => current.map((entry) => (entry.id === task.id ? updated : entry)));
    } catch {
      await loadData();
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      setTaskItems((current) => current.filter((entry) => entry.id !== task.id));
      await createActivityLog({ actionType: 'task_deleted', message: `Tâche supprimée : ${task.title}.`, projectId: task.projectId });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Suppression impossible');
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="luxury-title">Tâches</h1>
        <p className="text-sm text-muted">Pilotage des urgences et échéances.</p>
      </div>
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <Card className="space-y-5">
        <div className="grid gap-3 md:grid-cols-6">
          <input className="md:col-span-2" placeholder="Nouvelle tâche" value={title} onChange={(event) => setTitle(event.target.value)} />
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
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
          <Button onClick={() => void handleCreateTask()}>Créer</Button>
        </div>
        {loading ? (
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
                      Échéance {task.dueDate} · Statut {taskStatusLabel[task.status]}
                      {project ? ` · Chantier ${project.title}` : ''}
                      {client ? ` · Client ${client.firstName} ${client.lastName}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={task.priority === 'critique' ? 'warning' : 'muted'}>{task.priority}</Badge>
                    <Button className="px-3 py-1.5 text-xs" onClick={() => void handleToggleStatus(task)}>
                      {task.status === 'done' ? 'Rouvrir' : 'Terminer'}
                    </Button>
                    <Button className="border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-800 shadow-none hover:bg-zinc-200" onClick={() => void handleDeleteTask(task)}>
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
