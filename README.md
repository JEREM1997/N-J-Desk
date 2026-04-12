# N&J Desk

Application web premium de gestion de chantiers et suivi client pour **N&J Intérieurs**.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + Storage)

## Fonctionnalités V1

- Auth premium : `/login`, `/signup`
- Dashboard : KPI, activité récente, tâches prioritaires
- Module clients : liste + fiche détaillée
- Module chantiers : suivi statuts, finances, notes, uploads documents/photos
- Module tâches : création rapide et priorisation
- Journal d'activité (bloc dashboard)
- Paramètres : identité société, logo, préférences

## Branding / logo

Les assets de marque sont dans :

- `public/branding/logo-placeholder.svg`
- `public/branding/favicon.svg`

Vous pouvez remplacer ces fichiers directement pour appliquer votre logo final sans changer le code.

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:3000`.

## Configuration Supabase

1. Créez un projet Supabase.
2. Renseignez les variables dans `.env.local`.
3. Exécutez `supabase/schema.sql` puis `supabase/seed.sql` dans SQL Editor.
4. Créez un bucket Storage (ex: `project-files`) pour documents/photos.

## Schéma base de données

Tables incluses :

- `users`
- `clients`
- `projects`
- `tasks`
- `documents`
- `photos`
- `activity_logs`

Le schéma gère : relations, statuts, timestamps et champs financiers pour faire évoluer le produit.

## Notes UX/UI

- Direction minimaliste premium (beaucoup de blanc, gris subtils, noir profond)
- Composants réutilisables (Card, Button, Badge)
- Sidebar et cartes conçues pour un rendu SaaS haut de gamme
- Responsive desktop + mobile

