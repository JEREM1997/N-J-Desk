export type ProjectStatus =
  | 'prospect'
  | 'devis_envoye'
  | 'devis_accepte'
  | 'planifie'
  | 'en_cours'
  | 'termine'
  | 'sav';

export type Priority = 'basse' | 'moyenne' | 'haute' | 'critique';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  address: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  estimatedEndDate: string;
  quoteAmount: number;
  billedAmount: number;
  depositReceived: number;
  balanceReceived: number;
  internalNotes: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'todo' | 'en_cours' | 'done';
  priority: Priority;
  projectId?: string;
  clientId?: string;
}
