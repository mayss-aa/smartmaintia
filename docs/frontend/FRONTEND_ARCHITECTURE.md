# FRONTEND_ARCHITECTURE.md

# SmartMaint IA

## Frontend Architecture

Version : 1.0

---

# Objectif

Ce document définit l'architecture officielle du frontend SmartMaint IA.

Tous les développements React doivent respecter cette architecture.

L'objectif est de construire une application :

- modulaire
- maintenable
- évolutive
- fortement typée
- facilement testable
- cohérente avec le backend FastAPI

---

# Technologies

## Core

- React 19
- TypeScript
- Vite

---

## UI

- Tailwind CSS
- shadcn/ui
- Uiverse
- Lucide React

---

## Data

- Axios
- TanStack Query

---

## Forms

- React Hook Form
- Zod

---

## Routing

- React Router

---

## Tests

- Vitest
- React Testing Library
- Playwright

---

# Architecture générale

Le frontend suit une architecture :

```
Feature First
```

avec une séparation stricte entre :

- présentation
- logique métier
- appels API
- état global

---

# Structure du projet

```
frontend/

├── public/

├── src/

│   ├── app/

│   ├── assets/

│   ├── components/

│   ├── features/

│   ├── hooks/

│   ├── layouts/

│   ├── pages/

│   ├── router/

│   ├── services/

│   ├── store/

│   ├── styles/

│   ├── types/

│   ├── utils/

│   ├── constants/

│   ├── config/

│   ├── lib/

│   ├── App.tsx

│   └── main.tsx

├── tests/

└── package.json
```

Les responsabilités détaillées sont décrites dans :

```
FOLDER_STRUCTURE.md
```

---

# Architecture en couches

```
React Pages

        │

        ▼

Reusable Components

        │

        ▼

Hooks

        │

        ▼

Services

        │

        ▼

Axios

        │

        ▼

FastAPI

        │

        ▼

MySQL
```

---

# Principe Feature First

Chaque fonctionnalité possède son propre dossier.

Exemple :

```
users/

tickets/

planning/

dashboard/

alerts/

history/
```

Chaque feature contient :

```
components/

hooks/

services/

types/

utils/
```

---

# Composants

Tous les composants réutilisables sont centralisés dans :

```
src/components
```

Exemples :

- Sidebar
- Topbar
- DataTable
- Loader
- Modal
- MetricCard
- ConfirmDialog

Voir :

```
COMPONENT_LIBRARY.md
```

---

# Pages

Chaque page correspond à une route.

Exemple :

```
Login

Dashboard

Users

Test Benches

Tickets

Interventions

Planning

History

Alerts
```

Les pages :

- affichent les données
- utilisent les hooks
- ne contiennent pas de logique métier

---

# Services

Chaque module backend possède son service.

Exemple :

```
users.service.ts

tickets.service.ts

dashboard.service.ts
```

Tous les appels HTTP passent par Axios.

Voir :

```
API_CONSUMPTION.md
```

---

# Gestion des données

Le frontend utilise exclusivement :

```
TanStack Query
```

Interdictions :

❌ fetch()

❌ axios directement dans les composants

❌ useEffect pour charger les données

Toujours utiliser :

```
useQuery()

useMutation()
```

---

# Gestion des formulaires

Tous les formulaires utilisent :

```
React Hook Form

+

Zod
```

Aucune validation manuelle.

---

# Authentification

Authentification JWT.

Flux :

```
Login

↓

JWT

↓

/auth/me

↓

RBAC

↓

Application
```

Voir :

```
AUTHENTICATION.md
```

---

# RBAC

Le frontend adapte automatiquement :

- les menus
- les pages
- les actions

selon :

```
ADMINISTRATEUR

MANAGER_MAINTENANCE

TECHNICIEN

OPERATEUR_PRODUCTION
```

Voir :

```
FRONTEND_RBAC.md
```

---

# Navigation

React Router.

Routes protégées via :

```
ProtectedRoute
```

Les routes sont organisées par rôle.

---

# Design

Le frontend est inspiré de :

Sagemcom

Le design utilise :

- Tailwind CSS
- shadcn/ui
- Uiverse

Voir :

```
DESIGN_SYSTEM.md
```

---

# Responsive

Toutes les pages doivent fonctionner sur :

- Desktop
- Laptop
- Tablet
- Mobile

Aucun écran ne doit être réservé au desktop.

---

# Accessibilité

Tous les composants doivent respecter :

- navigation clavier
- aria-label
- focus visible
- contraste WCAG

---

# Tests

Chaque module possède :

- tests unitaires
- tests d'intégration

L'application complète possède :

- tests End-to-End avec Playwright

---

# Interdictions

❌ logique métier dans les composants

❌ appels Axios dans les pages

❌ duplication de composants

❌ CSS spécifique dispersé

❌ plusieurs DataTable

❌ plusieurs Sidebars

❌ plusieurs Providers pour une même responsabilité

---

# Bonnes pratiques

✔ TypeScript strict

✔ composants réutilisables

✔ séparation UI / logique métier

✔ architecture modulaire

✔ Feature First

✔ services dédiés

✔ hooks dédiés

✔ code testable

✔ frontend cohérent avec le backend

---

# Références

- FOLDER_STRUCTURE.md
- DESIGN_SYSTEM.md
- COMPONENT_LIBRARY.md
- API_CONSUMPTION.md
- AUTHENTICATION.md
- FRONTEND_RBAC.md
- FRONTEND_DEVELOPMENT_RULES.md