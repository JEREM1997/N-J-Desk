# Supabase Integration Playbook (N&J Desk)

Ce document donne l'ordre d'implémentation recommandé pour passer du mode `localStorage` à un mode Supabase complet et sécurisé.

## 1) Pré-requis projet
- Configurer `.env.local` et Vercel avec :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vérifier que `/login` fonctionne avec `lib/supabase.ts`.

## 2) Base de données
- Exécuter :
  1. `supabase/schema.sql`
  2. `supabase/seed.sql` (optionnel en prod)
  3. `supabase/rls.sql`

## 3) Sécurité (obligatoire)
- Activer RLS sur toutes les tables métier.
- Vérifier les policies sur un compte A/B (isolation stricte).

## 4) Couche repository
Les fichiers existent déjà :
- `lib/repositories/base.ts`
- `lib/repositories/clients.ts`
- `lib/repositories/projects.ts`
- `lib/repositories/tasks.ts`

## 5) Migration page par page (ordre recommandé)
1. Clients
2. Projects
3. Tasks
4. Dashboard
5. Documents / Photos
6. SAV
7. Finance

## 6) Documents/Photos
- Basculer de `localStorage` vers Supabase Storage + table SQL.
- Sauver `file_path`, `mime_type`, `size_bytes`.

## 7) Nettoyage final
- Retirer `lib/data-store.ts` des pages migrées.
- Garder seulement fallback DEV si nécessaire.

## 8) Validation finale
- Lint/build OK
- Login/logout OK
- CRUD complet sur clients/projects/tasks
- Isolation des données entre utilisateurs validée
- Déploiement Vercel avec variables d'environnement OK
