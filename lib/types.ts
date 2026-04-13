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
  postalCode: string;
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

export interface ProjectDocument {
  id: string;
  projectId: string;
  fileName: string;
  category: 'devis' | 'facture' | 'plan' | 'contrat' | 'autre';
  uploadedAt: string;
  fileUrl?: string;
}

export interface ProjectPhoto {
  id: string;
  projectId: string;
  phase: 'avant' | 'apres';
  caption: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface ServiceTicket {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  priority: Priority;
  status: 'ouvert' | 'planifie' | 'resolu';
  dueDate: string;
}
