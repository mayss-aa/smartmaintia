# FRONTEND_BACKLOG.md

# SmartMaint IA

## Frontend Product Backlog

Version : 1.0

---

# Objectif

Ce document définit l'ordre officiel de développement du frontend SmartMaint IA.

Les modules doivent être développés dans cet ordre.

Chaque module doit être entièrement terminé, testé et validé avant de commencer le suivant.

---

# Module 1 — Initialisation du projet

## Objectif

Mettre en place le socle technique du frontend.

## Tâches

- Initialiser React avec Vite
- Configurer TypeScript
- Installer Tailwind CSS
- Installer shadcn/ui
- Installer Uiverse (uniquement les composants nécessaires)
- Installer Axios
- Installer TanStack Query
- Installer React Hook Form
- Installer Zod
- Installer React Router
- Installer Lucide React
- Configurer ESLint
- Configurer Prettier
- Configurer les alias TypeScript
- Configurer les variables d'environnement
- Configurer la structure officielle des dossiers

Critère de validation :

Le projet compile sans erreur.

---

# Module 2 — Authentification

## Objectif

Mettre en place l'authentification JWT.

## Pages

- Login

## Fonctionnalités

- formulaire de connexion
- validation
- stockage JWT
- récupération utilisateur
- logout
- ProtectedRoute
- gestion RBAC

API

```
POST /auth/login

GET /auth/me

POST /auth/logout
```

Validation :

Connexion fonctionnelle.

---

# Module 3 — Layout global

## Objectif

Créer la structure commune.

## Composants

- AppLayout
- Sidebar
- Topbar
- PageHeader
- Breadcrumb
- Loader
- Toast
- Forbidden
- NotFound

Validation

Navigation fonctionnelle.

---

# Module 4 — Dashboard

## Objectif

Créer le Dashboard Manager.

API

```
GET /dashboard
```

Composants

- MetricCard
- ChartCard
- StatusBadge

Validation

Toutes les statistiques sont affichées.

---

# Module 5 — Gestion des utilisateurs

API

```
GET /users

GET /users/{id}

POST /users

PUT /users/{id}

DELETE /users/{id}
```

Pages

- Liste
- Création
- Modification
- Consultation

Validation

CRUD complet.

---

# Module 6 — Gestion des bancs

API

```
GET /bancs

GET /bancs/{code}

POST /bancs

PUT /bancs/{code}

DELETE /bancs/{code}
```

Validation

CRUD complet.

---

# Module 7 — Tickets

API

```
GET /tickets

GET /tickets/{id}

POST /tickets

PUT /tickets/{id}

DELETE /tickets/{id}
```

Fonctionnalités

- liste
- création
- consultation
- modification
- suppression
- filtres
- recherche

---

# Module 8 — Interventions

API

```
GET /interventions

GET /interventions/{id}

POST /interventions

PUT /interventions/{id}

DELETE /interventions/{id}
```

Fonctionnalités

- liste
- affectation
- consultation
- clôture

---

# Module 9 — Planning

API

```
GET /planning

POST /planning

PUT /planning/{id}
```

Fonctionnalités

- planning technicien
- planning manager

---

# Module 10 — Historique

API

```
GET /historiques

GET /historiques/{id}
```

Fonctionnalités

- consultation
- filtres
- recherche

---

# Module 11 — Alertes

API

```
GET /alertes

GET /alertes/{id}
```

Fonctionnalités

- liste
- détail

Aucune logique IA.

---

# Module 12 — Intégration Frontend ↔ Backend

Objectif

Vérifier l'intégration complète.

Contrôles

- JWT
- RBAC
- Axios
- React Query
- erreurs HTTP
- pagination
- validation
- navigation

---

# Module 13 — Tests

## Tests unitaires

- composants
- hooks
- services

## Tests d'intégration

- pages
- formulaires
- API

## Tests End-to-End

Playwright

Scénarios

- Login
- CRUD Utilisateur
- CRUD Banc
- CRUD Ticket
- CRUD Intervention
- Planning
- Dashboard
- Historique
- Alertes
- RBAC

---

# Module 14 — Optimisation

Objectifs

- optimisation des performances
- Lazy Loading
- Code Splitting
- Accessibilité
- Responsive
- SEO technique
- Audit Lighthouse

---

# Module 15 — Préparation IA (sans implémentation)

## Objectif

Préparer le frontend à recevoir les futurs modules IA.

Aucune logique IA ne doit être développée.

Préparer uniquement :

- composants réutilisables
- emplacements dans l'interface
- services vides
- types
- routes

Les fonctionnalités IA seront développées dans une phase ultérieure.

---

# Règles de développement

Après chaque module :

- Vérifier la compilation.
- Exécuter les tests du module.
- Vérifier le lint.
- Vérifier le typage TypeScript.
- Vérifier l'intégration avec le backend.
- Vérifier le respect du RBAC.
- Vérifier le responsive.
- Vérifier l'accessibilité.
- Produire un rapport détaillé.
- Passer automatiquement au module suivant si aucune anomalie critique n'est détectée.

---

# Références

- FRONTEND_ARCHITECTURE.md
- API_CONSUMPTION.md
- COMPONENT_LIBRARY.md
- DESIGN_SYSTEM.md
- FRONTEND_RBAC.md
- FRONTEND_DEVELOPMENT_RULES.md
- API_SPECIFICATION.md