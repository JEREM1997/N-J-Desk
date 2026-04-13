import { activityLogs, clients, projectDocuments, projectPhotos, projects, serviceTickets, tasks } from '@/lib/mock-data';
import type { Client, Project, ProjectDocument, ProjectPhoto, ServiceTicket, Task } from '@/lib/types';

const STORAGE_KEYS = {
  clients: 'njdesk.clients',
  projects: 'njdesk.projects',
  tasks: 'njdesk.tasks',
  activityLogs: 'njdesk.activityLogs',
  documents: 'njdesk.documents',
  photos: 'njdesk.photos',
  serviceTickets: 'njdesk.serviceTickets'
} as const;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readFromStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredClients() {
  return readFromStorage<Client[]>(STORAGE_KEYS.clients, clients);
}

export function setStoredClients(value: Client[]) {
  writeToStorage(STORAGE_KEYS.clients, value);
}

export function getStoredProjects() {
  return readFromStorage<Project[]>(STORAGE_KEYS.projects, projects);
}

export function setStoredProjects(value: Project[]) {
  writeToStorage(STORAGE_KEYS.projects, value);
}

export function getStoredTasks() {
  return readFromStorage<Task[]>(STORAGE_KEYS.tasks, tasks);
}

export function setStoredTasks(value: Task[]) {
  writeToStorage(STORAGE_KEYS.tasks, value);
}

export function getStoredActivityLogs() {
  return readFromStorage<string[]>(STORAGE_KEYS.activityLogs, activityLogs);
}

export function appendActivityLog(message: string) {
  const current = getStoredActivityLogs();
  const next = [message, ...current].slice(0, 30);
  writeToStorage(STORAGE_KEYS.activityLogs, next);
}

export function getStoredDocuments() {
  return readFromStorage<ProjectDocument[]>(STORAGE_KEYS.documents, projectDocuments);
}

export function setStoredDocuments(value: ProjectDocument[]) {
  writeToStorage(STORAGE_KEYS.documents, value);
}

export function getStoredPhotos() {
  return readFromStorage<ProjectPhoto[]>(STORAGE_KEYS.photos, projectPhotos);
}

export function setStoredPhotos(value: ProjectPhoto[]) {
  writeToStorage(STORAGE_KEYS.photos, value);
}

export function getStoredServiceTickets() {
  return readFromStorage<ServiceTicket[]>(STORAGE_KEYS.serviceTickets, serviceTickets);
}

export function setStoredServiceTickets(value: ServiceTicket[]) {
  writeToStorage(STORAGE_KEYS.serviceTickets, value);
}
