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
2. Copiez `.env.example` vers `.env.local`.
3. Renseignez **obligatoirement** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Exécutez `supabase/schema.sql`, puis `supabase/seed.sql`, puis `supabase/rls.sql` dans SQL Editor.
5. Si votre DB existait déjà avant ces évolutions, exécutez aussi `supabase/patch_required_fields.sql`.
6. Créez un bucket Storage (ex: `project-files`) pour documents/photos.

Exemple :

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Déploiement Vercel (important)

Ajoutez les mêmes variables dans **Vercel > Project Settings > Environment Variables** :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Si elles ne sont pas définies, l'authentification ne peut pas fonctionner.

## Playbook d'intégration Supabase

L'ordre recommandé d'implémentation est documenté ici :

- `docs/supabase-integration-playbook.md`

## Schéma base de données

Tables incluses :

- `users`
- `clients`
- `projects`
- `tasks`
- `documents`
- `photos`
- `activity_logs`
- `service_tickets`

Le schéma gère : relations, statuts, timestamps et champs financiers pour faire évoluer le produit.

## Notes UX/UI

- Direction minimaliste premium (beaucoup de blanc, gris subtils, noir profond)
- Composants réutilisables (Card, Button, Badge)
- Sidebar et cartes conçues pour un rendu SaaS haut de gamme
- Responsive desktop + mobile
