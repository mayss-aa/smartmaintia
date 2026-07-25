# ROUTING.md

# SmartMaint IA

## Frontend Routing

Version : 1.0

---

# Objectif

Ce document définit le système de routage officiel du frontend SmartMaint IA.

Toutes les routes doivent être protégées, organisées et cohérentes avec le système RBAC.

La navigation repose exclusivement sur **React Router**.

---

# Technologies

Le routage utilise :

- React Router
- ProtectedRoute
- RBAC
- JWT Authentication

---

# Architecture

```
BrowserRouter

        │

        ▼

App

        │

        ▼

AppRoutes

        │

        ▼

ProtectedRoute

        │

        ▼

Requested Page
```

---

# Organisation

```
src/

router/

    index.tsx

    routes.ts

    ProtectedRoute.tsx

    navigation.ts

    guards.ts
```

---

# Types de routes

Le frontend possède quatre catégories de routes.

## Routes publiques

Accessibles sans authentification.

```
/login
```

---

## Routes protégées

Accessibles uniquement avec un JWT valide.

```
/dashboard

/users

/test-benches

/tickets

/interventions

/planning

/history

/alerts

/profile
```

---

## Routes système

```
/403

/404
```

---

## Route par défaut

```
/
```

Redirige automatiquement :

```
→ /dashboard

ou

→ /login
```

selon l'état de connexion.

---

# Arborescence

```
/

├── login

├── dashboard

├── users

├── test-benches

├── tickets

├── interventions

├── planning

├── history

├── alerts

├── profile

├── 403

└── 404
```

---

# ProtectedRoute

Toutes les routes protégées utilisent :

```
ProtectedRoute
```

Responsabilités :

- vérifier le JWT
- vérifier le rôle
- empêcher les accès non autorisés
- effectuer les redirections nécessaires

---

# Vérification JWT

Le composant vérifie :

```
JWT présent

↓

JWT valide

↓

Utilisateur chargé

↓

Accès autorisé
```

En cas d'échec :

```
↓

/login
```

---

# Vérification RBAC

Le rôle utilisateur est obtenu via :

```
GET /auth/me
```

Puis comparé aux rôles autorisés.

Exemple :

```
Dashboard

↓

ADMINISTRATEUR

MANAGER_MAINTENANCE
```

Si le rôle est refusé :

```
↓

/403
```

---

# Mapping des routes

| Route | ADMIN | MANAGER | TECHNICIEN | OPERATEUR |
|--------|:-----:|:-------:|:----------:|:---------:|
| /dashboard | ✅ | ✅ | ❌ | ❌ |
| /users | ✅ | ❌ | ❌ | ❌ |
| /test-benches | ✅ | ❌ | ❌ | ❌ |
| /tickets | ❌ | ✅ | ✅* | ✅* |
| /interventions | ❌ | ✅ | ✅ | ❌ |
| /planning | ❌ | ✅ | ✅ | ❌ |
| /history | ✅ | ✅ | ✅* | ❌ |
| /alerts | ✅ | ✅ | ❌ | ❌ |
| /profile | ✅ | ✅ | ✅ | ✅ |

(*) limité aux données autorisées par le backend.

---

# Navigation

La Sidebar est générée automatiquement.

Chaque entrée possède :

- titre
- icône
- route
- rôles autorisés

Les menus sont construits à partir d'une configuration centralisée.

---

# Lazy Loading

Toutes les pages principales utilisent :

```
React.lazy()
```

et

```
Suspense
```

afin d'améliorer les performances.

---

# Redirections

Après connexion :

ADMINISTRATEUR

```
→ /dashboard
```

MANAGER

```
→ /dashboard
```

TECHNICIEN

```
→ /planning
```

OPERATEUR

```
→ /tickets
```

---

# Gestion des erreurs

JWT expiré

↓

```
/login
```

---

Permission refusée

↓

```
/403
```

---

Route inexistante

↓

```
/404
```

---

# Navigation après déconnexion

```
Logout

↓

Suppression du JWT

↓

Nettoyage du cache React Query

↓

/login
```

---

# Paramètres d'URL

Les routes utilisant des identifiants suivent le backend.

Exemples :

```
/users/:id

/test-benches/:code_banc

/tickets/:id_ticket

/interventions/:id_intervention

/history/:id_historique

/alerts/:id_alerte
```

Aucun autre format n'est autorisé.

---

# Breadcrumb

Toutes les pages protégées affichent un fil d'Ariane.

Exemple :

```
Dashboard

>

Tickets

>

Détail
```

---

# Tests

Les tests doivent vérifier :

- accès aux routes publiques ;
- accès aux routes protégées ;
- redirection après login ;
- redirection après logout ;
- protection RBAC ;
- redirection 403 ;
- redirection 404 ;
- lazy loading ;
- navigation Sidebar.

---

# Interdictions

❌ Routes codées en dur dans les composants

❌ Navigation sans ProtectedRoute

❌ Vérification RBAC dans les pages

❌ Multiples systèmes de navigation

❌ Redirections incohérentes

---

# Bonnes pratiques

✔ Toutes les routes sont centralisées.

✔ Les chemins sont définis dans des constantes.

✔ Les rôles sont vérifiés uniquement dans ProtectedRoute.

✔ Les pages restent indépendantes de la logique de navigation.

✔ Les menus sont générés automatiquement à partir de la configuration.

---

# Références

- FRONTEND_ARCHITECTURE.md
- FRONTEND_RBAC.md
- AUTHENTICATION.md
- API_CONSUMPTION.md
- FRONTEND_PAGES.md
- FOLDER_STRUCTURE.md