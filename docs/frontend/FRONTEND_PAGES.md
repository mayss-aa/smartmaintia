# FRONTEND_PAGES.md

# SmartMaint IA

## Frontend Pages Specification

Version : 1.0

---

# Objectif

Ce document décrit toutes les pages du frontend SmartMaint IA.

Pour chaque page sont définis :

- son objectif ;
- les rôles autorisés ;
- les API consommées ;
- les composants utilisés ;
- les validations ;
- les actions possibles ;
- la navigation.

Aucune page ne doit être développée en dehors de cette documentation.

---

# 1. Login

## Route

```
/login
```

## Objectif

Authentifier l'utilisateur.

## Rôles

Tous.

## API

```
POST /auth/login

GET /auth/me
```

## Composants

- LoginCard
- Input
- PasswordInput
- SubmitButton
- Loader
- Toast

## Validation

- email obligatoire
- mot de passe obligatoire

## Navigation

Connexion réussie

↓

Dashboard correspondant au rôle

---

# 2. Dashboard

## Route

```
/dashboard
```

## Objectif

Afficher une vue globale du système.

## Rôles

- ADMINISTRATEUR
- MANAGER_MAINTENANCE

## API

```
GET /dashboard
```

## Composants

- MetricCard
- ChartCard
- StatusBadge
- Loader
- EmptyState

## Validation

Lecture seule.

---

# 3. Gestion des utilisateurs

## Route

```
/users
```

## Objectif

Administrer les utilisateurs.

## Rôles

ADMINISTRATEUR uniquement.

## API

```
GET /users

GET /users/{id}

POST /users

PUT /users/{id}

DELETE /users/{id}
```

## Composants

- DataTable
- UserForm
- Modal
- ConfirmDialog
- SearchBar
- Pagination

## Validation

CRUD complet.

---

# 4. Gestion des bancs

## Route

```
/test-benches
```

## Objectif

Administrer les bancs de test.

## Rôles

ADMINISTRATEUR uniquement.

## API

```
GET /bancs

GET /bancs/{code_banc}

POST /bancs

PUT /bancs/{code_banc}

DELETE /bancs/{code_banc}
```

## Composants

- DataTable
- TestBenchForm
- Modal
- ConfirmDialog

---

# 5. Tickets

## Route

```
/tickets
```

## Objectif

Consulter et gérer les tickets.

## Rôles

- MANAGER_MAINTENANCE
- TECHNICIEN
- OPERATEUR_PRODUCTION (consultation de ses tickets uniquement)

## API

```
GET /tickets

GET /tickets/{id}

POST /tickets

PUT /tickets/{id}

DELETE /tickets/{id}
```

## Composants

- DataTable
- TicketForm
- SearchBar
- FilterPanel
- StatusBadge

---

# 6. Interventions

## Route

```
/interventions
```

## Objectif

Gérer les interventions.

## Rôles

- MANAGER_MAINTENANCE
- TECHNICIEN

## API

```
GET /interventions

GET /interventions/{id}

POST /interventions

PUT /interventions/{id}

DELETE /interventions/{id}
```

## Composants

- DataTable
- InterventionForm
- StatusBadge
- ConfirmDialog

---

# 7. Planning

## Route

```
/planning
```

## Objectif

Afficher les interventions planifiées.

## Rôles

- MANAGER_MAINTENANCE
- TECHNICIEN

## API

```
GET /planning

POST /planning

PUT /planning/{id}
```

## Composants

- Calendar
- PlanningTable
- FilterPanel

---

# 8. Historique

## Route

```
/history
```

## Objectif

Consulter l'historique des interventions.

## Rôles

- ADMINISTRATEUR
- MANAGER_MAINTENANCE
- TECHNICIEN (son historique uniquement)

## API

```
GET /historiques

GET /historiques/{id_historique}
```

## Composants

- DataTable
- SearchBar
- StatusBadge

Lecture seule.

---

# 9. Alertes

## Route

```
/alerts
```

## Objectif

Consulter les alertes prédictives enregistrées.

Aucune logique IA.

## Rôles

- ADMINISTRATEUR
- MANAGER_MAINTENANCE

## API

```
GET /alertes

GET /alertes/{id_alerte}
```

## Composants

- DataTable
- AlertCard
- StatusBadge

Lecture seule.

---

# 10. Déclaration d'incident

## Route

```
/incident
```

## Objectif

Permettre à un opérateur de déclarer un incident.

## Rôles

OPERATEUR_PRODUCTION uniquement.

## API

```
GET /bancs

POST /tickets
```

## Composants

- IncidentForm
- Select
- Textarea
- SubmitButton

## Validation

- banc obligatoire
- description obligatoire

---

# 11. Profil utilisateur

## Route

```
/profile
```

## Objectif

Afficher les informations de l'utilisateur connecté.

## Rôles

Tous les utilisateurs authentifiés.

## API

```
GET /auth/me
```

## Composants

- ProfileCard
- Avatar
- UserInfo

Lecture seule.

---

# Pages techniques

## Forbidden

```
/403
```

Accès refusé.

---

## Not Found

```
/404
```

Page inexistante.

---

# Layout

Toutes les pages protégées utilisent :

- AppLayout
- Sidebar
- Topbar
- Breadcrumb
- PageHeader

Le Login utilise :

- AuthLayout

---

# Responsive

Toutes les pages doivent fonctionner sur :

- Desktop
- Laptop
- Tablet
- Mobile

---

# Références

- FRONTEND_ARCHITECTURE.md
- FOLDER_STRUCTURE.md
- COMPONENT_LIBRARY.md
- DESIGN_SYSTEM.md
- API_CONSUMPTION.md
- FRONTEND_RBAC.md
- API_SPECIFICATION.md
- RBAC.md