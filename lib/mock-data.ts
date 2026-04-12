import { Client, Project, Task } from '@/lib/types';

export const clients: Client[] = [
  {
    id: 'cli_001',
    firstName: 'Camille',
    lastName: 'Lemaire',
    phone: '+33 6 45 22 18 74',
    email: 'camille.lemaire@email.com',
    address: '12 avenue Foch, Paris',
    notes: 'Préfère les finitions chêne clair, disponibilité après 18h.'
  },
  {
    id: 'cli_002',
    firstName: 'Alexandre',
    lastName: 'Moreau',
    phone: '+33 6 18 07 92 53',
    email: 'a.moreau@email.com',
    address: '5 rue du Bac, Lyon',
    notes: 'Suivi hebdomadaire demandé le vendredi.'
  }
];

export const projects: Project[] = [
  {
    id: 'cha_001',
    clientId: 'cli_001',
    title: 'Rénovation cuisine & séjour',
    address: '12 avenue Foch, Paris',
    description: 'Refonte complète cuisine ouverte, menuiseries sur mesure et éclairage indirect.',
    status: 'en_cours',
    startDate: '2026-03-10',
    estimatedEndDate: '2026-05-22',
    quoteAmount: 48000,
    billedAmount: 24000,
    depositReceived: 14400,
    balanceReceived: 9600,
    internalNotes: 'Valider teinte laiton brossé avec la cliente mercredi.'
  },
  {
    id: 'cha_002',
    clientId: 'cli_002',
    title: 'Aménagement suite parentale',
    address: '5 rue du Bac, Lyon',
    description: 'Dressing premium, tête de lit sur mesure, peinture minérale.',
    status: 'devis_accepte',
    startDate: '2026-04-18',
    estimatedEndDate: '2026-06-20',
    quoteAmount: 36000,
    billedAmount: 0,
    depositReceived: 10800,
    balanceReceived: 0,
    internalNotes: 'Commande tissu à lancer après métré final.'
  }
];

export const tasks: Task[] = [
  {
    id: 'tsk_001',
    title: 'Planifier réunion artisan plomberie',
    dueDate: '2026-04-14',
    status: 'todo',
    priority: 'haute',
    projectId: 'cha_001'
  },
  {
    id: 'tsk_002',
    title: 'Envoyer relance acompte',
    dueDate: '2026-04-13',
    status: 'en_cours',
    priority: 'critique',
    clientId: 'cli_002'
  }
];

export const activityLogs = [
  'Chantier “Rénovation cuisine & séjour” passé au statut En cours.',
  'Nouveau document ajouté : plan_eclairage_v3.pdf',
  'Note client mise à jour pour Camille Lemaire.',
  'Acompte reçu pour “Aménagement suite parentale”.'
];
