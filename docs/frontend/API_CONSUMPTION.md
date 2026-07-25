# API_CONSUMPTION.md

# SmartMaint IA

## Frontend API Consumption Guide

Version : 1.0

---

# Objectif

Ce document décrit les règles obligatoires pour la consommation des API du backend FastAPI.

Le frontend ne doit jamais appeler directement une URL FastAPI depuis une page React.

Toutes les communications doivent passer par une couche de services dédiée.

---

# Architecture

Le frontend communique uniquement avec :

```
React
        │
        ▼
React Query
        │
        ▼
Axios Service
        │
        ▼
FastAPI REST API
        │
        ▼
MySQL
```

Aucun composant React ne doit effectuer directement :

```ts
fetch(...)
```

ou

```ts
axios(...)
```

---

# Organisation

```
src/

services/

    api.ts

    auth.service.ts

    users.service.ts

    benches.service.ts

    tickets.service.ts

    interventions.service.ts

    planning.service.ts

    historiques.service.ts

    alertes.service.ts

    dashboard.service.ts
```

Chaque service correspond exactement à un module backend.

---

# Base URL

Toutes les requêtes utilisent :

```
/api/v1
```

Exemple :

```
/api/v1/users

/api/v1/tickets

/api/v1/dashboard
```

La Base URL provient exclusivement des variables d'environnement.

```
VITE_API_URL=http://localhost:8000/api/v1
```

Aucune URL ne doit être écrite en dur.

---

# Axios Instance

Une seule instance Axios est autorisée.

```
api.ts
```

Responsabilités :

- baseURL
- timeout
- headers
- interceptors
- JWT
- erreurs globales

---

# JWT

Après authentification :

```
POST /auth/login
```

Le backend retourne :

```
access_token

token_type
```

Le frontend :

- stocke le token
- ajoute automatiquement

```
Authorization

Bearer <token>
```

sur toutes les requêtes.

---

# Authentification

Login

```
POST

/auth/login
```

Utilisateur courant

```
GET

/auth/me
```

Logout

```
POST

/auth/logout
```

---

# Services

## AuthService

Responsabilités

- login
- logout
- current user

---

## UserService

Consomme

```
GET /users

GET /users/{id}

POST /users

PUT /users/{id}

DELETE /users/{id}
```

---

## TestBenchService

Consomme

```
GET /bancs

GET /bancs/{code}

POST /bancs

PUT /bancs/{code}

DELETE /bancs/{code}
```

---

## TicketService

Consomme

```
GET /tickets

GET /tickets/{id}

POST /tickets

PUT /tickets/{id}

DELETE /tickets/{id}
```

---

## InterventionService

Consomme

```
GET /interventions

GET /interventions/{id}

POST /interventions

PUT /interventions/{id}

DELETE /interventions/{id}
```

---

## PlanningService

Consomme

```
GET /planning

POST /planning

PUT /planning/{id}
```

---

## HistoriqueService

Consomme

```
GET /historiques

GET /historiques/{id}
```

---

## AlerteService

Consomme

```
GET /alertes

GET /alertes/{id}
```

---

## DashboardService

Consomme

```
GET /dashboard
```

---

# React Query

Toutes les données serveur utilisent exclusivement

TanStack Query.

Interdiction :

```
useEffect()

+

axios
```

pour charger des données.

Toujours utiliser :

```
useQuery()

useMutation()
```

---

# Gestion des erreurs

Toutes les erreurs HTTP sont gérées par Axios.

Gestion prévue :

401

→ redirection Login

403

→ page Forbidden

404

→ page Not Found

409

→ message métier

422

→ erreurs formulaire

500

→ notification globale

---

# Pagination

Toutes les listes utilisent :

```
skip

limit
```

conformément au backend.

---

# Filtres

Les paramètres sont envoyés via :

```
params
```

Exemple

```
GET

/tickets

?status=OPEN

?skip=0

?limit=20
```

---

# Upload

Si un endpoint d'upload est ajouté :

utiliser

```
multipart/form-data
```

uniquement.

---

# Sécurité

Interdictions :

❌ stocker le mot de passe

❌ stocker le JWT dans le code

❌ appels directs

❌ duplication des services

❌ modifier les réponses du backend

---

# Bonnes pratiques

Chaque module possède :

- son service

- ses hooks React Query

- ses types

- ses composants

- ses pages

Aucune logique métier dans les composants.

---

# Tests

Chaque service devra être testé.

Les tests doivent vérifier :

- succès

- erreurs HTTP

- timeout

- JWT

- permissions

---

# Références

- API_SPECIFICATION.md

- RBAC.md

- PERMISSIONS_MATRIX.md

- FRONTEND_ARCHITECTURE.md

- FRONTEND_DEVELOPMENT_RULES.md