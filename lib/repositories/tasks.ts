import { Task } from '@/lib/types';
import { supabaseDelete, supabaseInsert, supabaseSelect, supabaseUpdate } from './base';

interface TaskRow {
  id: string;
  title: string;
  due_date: string | null;
  status: Task['status'];
  priority: Task['priority'];
  project_id: string | null;
  client_id: string | null;
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date ?? '',
    status: row.status,
    priority: row.priority,
    projectId: row.project_id ?? undefined,
    clientId: row.client_id ?? undefined
  };
}

function toRow(task: Partial<Task>) {
  return {
    title: task.title,
    due_date: task.dueDate,
    status: task.status,
    priority: task.priority,
    project_id: task.projectId ?? null,
    client_id: task.clientId ?? null
  };
}

export async function listTasks() {
  const rows = await supabaseSelect<TaskRow>('tasks', 'select=id,title,due_date,status,priority,project_id,client_id&order=created_at.desc');
  return rows.map(toTask);
}

export async function createTask(task: Omit<Task, 'id'>) {
  const row = await supabaseInsert<TaskRow>('tasks', toRow(task));
  return toTask(row);
}

export async function updateTask(id: string, patch: Partial<Omit<Task, 'id'>>) {
  const row = await supabaseUpdate<TaskRow>('tasks', id, toRow(patch));
  return toTask(row);
}

export async function deleteTask(id: string) {
  await supabaseDelete('tasks', id);
}
