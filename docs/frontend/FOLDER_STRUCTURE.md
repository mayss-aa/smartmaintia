# FOLDER_STRUCTURE.md

# SmartMaint IA

## Frontend Folder Structure

Version : 1.0

---

# Objectif

Ce document définit l'organisation officielle du frontend SmartMaint IA.

Tous les développements doivent respecter cette architecture.

Aucun fichier ne doit être créé en dehors de cette structure sans justification.

---

# Architecture générale

```
frontend/

├── public/
│
├── src/
│
│   ├── app/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── features/
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │
│   ├── router/
│   │
│   ├── services/
│   │
│   ├── store/
│   │
│   ├── styles/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── config/
│   │
│   ├── lib/
│   │
│   ├── App.tsx
│   │
│   └── main.tsx
│
├── tests/
│
├── package.json
│
├── tsconfig.json
│
├── vite.config.ts
│
└── tailwind.config.ts
```

---

# app/

Contient :

- Providers
- Initialisation
- React Query Provider
- Theme Provider
- Router Provider

Aucun composant métier.

---

# assets/

Organisation :

```
assets/

images/

icons/

logos/

fonts/
```

Uniquement des ressources statiques.

---

# components/

Contient uniquement des composants réutilisables.

Organisation :

```
components/

layout/

navigation/

dashboard/

forms/

table/

feedback/

common/

ui/
```

Interdiction :

Créer des composants spécifiques à une seule page.

---

# features/

Chaque fonctionnalité possède son propre dossier.

```
features/

auth/

dashboard/

users/

test-benches/

tickets/

interventions/

planning/

history/

alerts/
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

# hooks/

Hooks globaux.

Exemple :

```
useAuth()

useDebounce()

usePagination()

useToast()
```

Les hooks métier restent dans leur feature.

---

# layouts/

Layouts principaux.

```
AppLayout

AuthLayout
```

Tous les écrans utilisent AppLayout sauf Login.

---

# pages/

Une page = une route.

```
Login

Dashboard

Users

TestBenches

Tickets

Interventions

Planning

History

Alerts

NotFound

Forbidden
```

Les pages ne contiennent quasiment aucune logique.

---

# router/

Contient :

```
index.tsx

ProtectedRoute.tsx

Route Guards
```

Responsabilités :

- navigation

- RBAC

- protection JWT

---

# services/

Services Axios.

Un fichier par module.

```
api.ts

auth.service.ts

dashboard.service.ts

users.service.ts

test-benches.service.ts

tickets.service.ts

interventions.service.ts

planning.service.ts

history.service.ts

alerts.service.ts
```

Aucun appel Axios ailleurs.

---

# store/

Uniquement l'état global.

Exemple :

```
Auth

Theme
```

Les données serveur utilisent TanStack Query.

---

# styles/

```
globals.css

tailwind.css
```

Aucun CSS métier dans les composants.

---

# types/

Interfaces TypeScript.

Organisation :

```
auth.ts

dashboard.ts

user.ts

ticket.ts

intervention.ts

planning.ts

history.ts

alert.ts
```

---

# utils/

Fonctions utilitaires.

Exemple :

```
date.ts

format.ts

validators.ts

helpers.ts
```

---

# constants/

Constantes.

```
roles.ts

routes.ts

api.ts

status.ts
```

---

# config/

Configuration.

```
env.ts

axios.ts
```

---

# lib/

Configuration des bibliothèques.

Exemple :

```
react-query.ts

zod.ts
```

---

# tests/

Organisation :

```
unit/

integration/

e2e/
```

---

# Règles

Chaque feature possède :

```
components

hooks

services

types

utils
```

Les composants communs restent dans :

```
components/
```

---

# Interdictions

❌ appels Axios dans les pages

❌ logique métier dans les composants

❌ composants dupliqués

❌ hooks dupliqués

❌ plusieurs stores

❌ CSS dispersé

❌ dossiers sans utilité

---

# Bonnes pratiques

✔ architecture Feature First

✔ composants réutilisables

✔ TypeScript strict

✔ services séparés

✔ hooks dédiés

✔ pages légères

✔ séparation UI / logique métier

✔ facilement maintenable

---

# Références

- FRONTEND_ARCHITECTURE.md
- COMPONENT_LIBRARY.md
- FRONTEND_DEVELOPMENT_RULES.md
- DESIGN_SYSTEM.md