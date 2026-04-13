# Audit complet N&J Desk (13 avril 2026)

## Positionnement général
L'application est une **base de démonstration UI solide**, mais n'est pas encore un outil de production pour piloter une activité réelle de rénovation.

Niveau actuel estimé: **prototype premium (UI)**, pas encore **produit métier fiable**.

---

## 1) Cohérence globale

### Constats
- Les modules existent (clients, chantiers, tâches, paramètres), avec un vocabulaire métier cohérent.
- Les relations `client -> chantier` et `chantier -> tâches` sont partiellement visibles côté interface.
- En revanche, la majorité des données est locale au front (`mock-data`) et non synchronisée à la base.
- Les pages de détail récupèrent des données statiques et ne reflètent pas les créations/modifications faites depuis les autres écrans.

### Impacts
- Incohérence utilisateur immédiate: un client créé n'existe pas ailleurs.
- Risque de perte totale des actions (rechargement navigateur).

---

## 2) Logique métier (workflow prospect -> devis -> accepté -> chantier -> terminé -> SAV)

### Ce qui est bien
- Les statuts de projet couvrent le funnel principal (`prospect`, `devis_envoye`, `devis_accepte`, `planifie`, `en_cours`, `termine`, `sav`).

### Manques / défauts
- Aucun moteur de transition d'état (pas de règles: qui peut passer de quoi à quoi).
- Aucun objet "devis" dédié (montants stockés directement sur `projects`, sans versionning ni historique).
- Pas d'étapes intermédiaires critiques terrain: visite technique, validation matériaux, commande fournisseurs, réception chantier, réserves, PV de réception.
- SAV traité comme simple statut, pas comme cycle séparé (tickets, délais, responsabilité, clôture).

---

## 3) Utilité réelle pour une entreprise de rénovation

### Verdict
Utile pour une démo commerciale ou cadrage produit, **insuffisant pour exploitation quotidienne**.

### Ce qui manque pour devenir indispensable
- Persistance réelle + multi-utilisateurs.
- Journal d'activité horodaté et traçable.
- Pilotage financier réel (échéancier, reste à facturer, marge).
- Gestion documentaire exploitable (types de docs, versioning, validation).
- Vues opérationnelles: planning hebdo, charge équipes/artisans, alertes retards.

### Ce qui est superflu aujourd'hui
- Certaines finitions visuelles premium avant la fiabilité métier.

---

## 4) UX

### Frictions majeures
- Les actions semblent "fonctionner" mais ne persistent pas.
- Double zone de création client (barre haute + formulaire) ambiguë.
- Les fiches client ne sont pas accessibles depuis la table (pas de lien/clic row vers détail).
- Pas de feedback utilisateur (succès/erreur/validation).
- Libellés date/échéance non localisés et peu lisibles.

### Recommandations UX prioritaires
1. Ajouter toasts + états vides + erreurs explicites.
2. Rendre les lignes clients/projets cliquables vers le détail.
3. Structurer chaque écran autour de 3 blocs: KPI -> actions -> liste.
4. Ajouter filtres persistants (statut, échéance, commercial, zone géographique).

---

## 5) Interface & design

### Points forts
- Direction visuelle homogène, palette et composants cohérents.
- Sidebar et cartes bien alignées avec un style SaaS premium.

### Points faibles (premium incomplet)
- Trop de densité textuelle sur certaines cartes projets.
- Incohérences de microcopie (FR/technique), absence de hiérarchie visuelle sur actions critiques.
- Peu de composants de feedback (empty states, loading skeletons, erreurs inline).

### Pour un niveau Apple / SaaS haut de gamme
- Introduire un design token system strict (espacements/typographies normalisés).
- Uniformiser les boutons selon intention (primary, secondary, destructive).
- Ajouter animations d'état discrètes et systématiques.

---

## 6) Structure technique

### Forces
- Projet propre, simple, facile à lire.
- Composants UI réutilisables de base.

### Problèmes importants
- Logique métier embarquée dans les pages (pas de couche service/repository).
- Aucune intégration effective Supabase (pas de client utilisé pour CRUD).
- Mélange de mock statique et state local.
- Risques de divergence typage front vs schéma SQL.

### Recommandations
- Créer une architecture en couches:
  - `lib/domain/*` (règles métier)
  - `lib/data/*` (requêtes Supabase)
  - `app/*` (composition UI)
- Ajouter schémas de validation (Zod) pour formulaires et payloads.

---

## 7) Base de données (Supabase)

### Points corrects
- Tables principales utiles et relations globalement cohérentes.
- Types enum pour statuts/priorités: bon choix.

### Lacunes critiques
- Aucune policy RLS visible dans le schéma => risque d'accès transversal.
- Pas de contraintes métiers fortes (cohérence montants, bornes positives, dates).
- Modèle devis/facturation trop simplifié (pas de table `quotes`, `invoices`, `payments`).
- `tasks` peut référencer `project_id` et `client_id` sans règle explicite de cohérence.

### Schéma cible recommandé (haut niveau)
- `leads` (prospects)
- `quotes` + `quote_lines` + versions
- `projects`
- `project_milestones`
- `invoices` + `payments`
- `service_tickets` (SAV)
- `documents` avec `document_type`, `version`, `is_signed`

---

## 8) Performance & robustesse

### Risques
- Absence de pagination/virtualisation sur listes.
- Pas de gestion des collisions (édition concurrente).
- Pas de gestion des erreurs réseau/API.
- Tri des dates en string côté front (fonctionne partiellement, fragile si format change).

---

## 9) Sécurité

### Risques critiques
- Auth UI uniquement: pas de flux d'auth effectif.
- Pas de guard de route serveur.
- Aucun contrôle d'accès démontré côté base.
- Uploads potentiels non encadrés (type/poids/scanner absent).

### Priorité sécurité
- Mettre en place auth Supabase réelle + session serveur.
- Définir RLS par `owner_id` sur toutes les tables métier.
- Durcir uploads (MIME, taille, dossier par tenant, URL signées).

---

## 10) Priorités d'amélioration

### Problèmes critiques
1. Données non persistées.
2. Auth/permissions non opérationnelles.
3. Workflow métier incomplet (devis/facture/SAV non structurés).
4. Absence de validation et feedback utilisateur.

### Améliorations importantes
1. Refonte du modèle financier.
2. Vues opérationnelles planning/retards.
3. Traçabilité des actions et documents.
4. Navigation détaillée entre modules.

### Nice to have
1. Automatisations (rappels paiements, relances client).
2. Tableaux de bord marge par chantier.
3. Templates de compte-rendu et checklists mobiles.

---

## 11) Plan d'amélioration

### V1 (urgent, 2-4 semaines)
- Intégrer Supabase CRUD réel sur clients/projets/tâches.
- Ajouter RLS + guard routes.
- Ajouter validations formulaires + toasts + erreurs.
- Harmoniser navigation détail/listes.

### V2 (important, 4-8 semaines)
- Ajouter modules devis/facturation/paiements.
- Mettre en place workflow d'états contrôlé.
- Ajouter journal d'activité réel + timeline par client/chantier.
- Ajouter filtres avancés et sauvegarde de vues.

### V3 (premium, 8-12 semaines)
- Automatisations métier (email/SMS, relances).
- KPI de rentabilité/marge/temps.
- Expérience mobile terrain (photos, checklists, signatures).
- Finition design system enterprise.

---

## 12) Actions concrètes (problème -> solution -> fichiers)

1. **Données mock non persistées**
   - Solution: remplacer `mock-data` par data providers Supabase + server actions.
   - Fichiers: `lib/mock-data.ts`, `lib/supabase.ts`, `app/(app)/clients/page.tsx`, `app/(app)/projects/page.tsx`, `app/(app)/tasks/page.tsx`.

2. **Auth factice**
   - Solution: implémenter login/signup/reset via Supabase Auth + middleware de protection.
   - Fichiers: `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `app/page.tsx`, nouveau `middleware.ts`.

3. **RLS absente**
   - Solution: activer RLS + policies `owner_id = auth.uid()` (via mapping robuste).
   - Fichiers: `supabase/schema.sql`.

4. **Workflow chantier incomplet**
   - Solution: créer tables `quotes`, `invoices`, `payments`, `service_tickets` et contraintes de transitions.
   - Fichiers: `supabase/schema.sql`, nouvelles pages `app/(app)/quotes/*`, `app/(app)/billing/*`.

5. **UX de navigation incomplète**
   - Solution: liens detail partout + CTA contextualisés + états vides.
   - Fichiers: `app/(app)/clients/page.tsx`, `app/(app)/projects/page.tsx`, `app/(app)/dashboard/page.tsx`.

6. **Sécurité uploads**
   - Solution: flow upload signé côté serveur, validations strictes fichier.
   - Fichiers: nouveaux handlers API + `supabase/schema.sql` (metadata doc/photo enrichie).

---

## Résumé global

### Points forts
- Très bonne base UI premium.
- Modèle initial lisible, vocabulaire métier bien orienté rénovation.
- Code simple et maintenable au stade prototype.

### Points faibles
- Fiabilité métier insuffisante (persistance, sécurité, workflow incomplet).
- Décalage important entre promesse "outil pro" et réalité technique actuelle.
- Trop centré démonstration front, pas assez orienté opérations terrain.

### Potentiel
Potentiel **élevé** si exécution disciplinée sur V1/V2. Avec persistance, sécurité, finance et workflow complet, N&J Desk peut devenir un vrai cockpit d'exploitation rénovation.
