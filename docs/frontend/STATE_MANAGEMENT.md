# STATE_MANAGEMENT.md

# SmartMaint IA

## Frontend State Management

Version : 1.0

---

# Objectif

Ce document définit les règles officielles de gestion de l'état du frontend SmartMaint IA.

L'objectif est de garantir une architecture simple, cohérente et performante.

Chaque type de donnée possède un emplacement précis.

Aucune donnée ne doit être stockée au mauvais endroit.

---

# Architecture

Le frontend distingue deux types d'état :

```
Server State

↓

TanStack Query
```

et

```
Client State

↓

React Context
```

---

# Server State

Toutes les données provenant du backend FastAPI sont gérées exclusivement par :

```
TanStack Query
```

Exemples :

- utilisateurs
- bancs de test
- tickets
- interventions
- planning
- historique
- alertes
- dashboard

---

# Client State

Le React Context est réservé aux informations locales.

Uniquement :

- utilisateur connecté
- état de connexion
- thème (si ajouté ultérieurement)

Aucune donnée métier.

---

# Architecture générale

```
FastAPI

↓

Axios

↓

TanStack Query

↓

Hooks

↓

Components

↓

Pages
```

---

# Organisation

```
src/

store/

    auth/

        AuthContext.tsx

        AuthProvider.tsx

        useAuth.ts

hooks/

    useCurrentUser.ts

    usePermissions.ts

    useTheme.ts
```

---

# TanStack Query

Toutes les requêtes utilisent :

```
useQuery()

useMutation()
```

Interdictions :

❌ useEffect + axios

❌ fetch()

❌ stockage manuel des listes

---

# Queries

Chaque module possède ses propres queries.

Exemple

```
Users

↓

useUsers()

↓

GET /users
```

```
Dashboard

↓

useDashboard()

↓

GET /dashboard
```

```
Tickets

↓

useTickets()

↓

GET /tickets
```

---

# Mutations

Les opérations suivantes utilisent :

```
useMutation()
```

- création
- modification
- suppression
- login
- logout

---

# Cache

Le cache est géré uniquement par TanStack Query.

Après une mutation :

```
invalidateQueries()
```

doit être utilisé afin de recharger les données concernées.

Aucune mise à jour manuelle des listes sauf nécessité documentée.

---

# AuthContext

Le contexte global contient uniquement :

```
currentUser

accessToken

isAuthenticated

login()

logout()
```

Aucune donnée métier.

---

# Cycle d'authentification

```
Login

↓

POST /auth/login

↓

JWT

↓

GET /auth/me

↓

AuthContext

↓

ProtectedRoute
```

---

# Gestion du cache

Le cache doit être vidé lors :

- du logout
- de l'expiration du JWT

Le nettoyage s'effectue avec :

```
queryClient.clear()
```

---

# Clés de cache

Chaque module possède des clés explicites.

Exemple :

```
["dashboard"]

["users"]

["user", id]

["tickets"]

["ticket", id]

["planning"]

["history"]

["alerts"]
```

Éviter les clés ambiguës.

---

# Synchronisation

Les données affichées doivent toujours provenir du cache TanStack Query.

Les composants ne conservent pas de copie locale des listes récupérées depuis l'API.

---

# Gestion des erreurs

Toutes les erreurs réseau sont gérées par TanStack Query et Axios.

Les composants affichent :

- Loader pendant le chargement
- ErrorState en cas d'erreur
- EmptyState si aucune donnée

---

# Optimisation

Utiliser :

- cache automatique
- refetch intelligent
- pagination
- lazy loading si nécessaire

Éviter les requêtes répétées inutiles.

---

# Bonnes pratiques

✔ Une seule source de vérité pour les données serveur.

✔ Utiliser les hooks personnalisés.

✔ Réutiliser les Query Keys.

✔ Centraliser la configuration de TanStack Query.

✔ Séparer clairement l'état serveur et l'état client.

---

# Interdictions

❌ useEffect pour charger les données serveur

❌ appels Axios dans les composants

❌ stockage des listes dans Context

❌ duplication des données serveur

❌ plusieurs Context pour les mêmes informations

❌ gestion manuelle du cache

---

# Vérifications

Après chaque module :

- vérifier les Query Keys ;
- vérifier les mutations ;
- vérifier l'invalidation du cache ;
- vérifier les loaders ;
- vérifier les états d'erreur ;
- vérifier les états vides ;
- vérifier le fonctionnement hors ligne si applicable.

---

# Références

- FRONTEND_ARCHITECTURE.md
- API_CONSUMPTION.md
- AUTHENTICATION.md
- FRONTEND_DEVELOPMENT_RULES.md
- ROUTING.md