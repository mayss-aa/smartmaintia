# FRONTEND_RBAC.md

# SmartMaint IA

## Frontend Role-Based Access Control (RBAC)

Version : 1.0

---

# Objectif

Ce document définit les règles de contrôle d'accès du frontend SmartMaint IA.

Le frontend adapte automatiquement :

- les menus ;
- les pages ;
- les boutons ;
- les actions ;
- les composants.

selon le rôle de l'utilisateur authentifié.

Le frontend ne remplace jamais la sécurité du backend.

Le backend reste la source de vérité.

---

# Rôles

Le système comporte quatre rôles.

```
ADMINISTRATEUR

MANAGER_MAINTENANCE

TECHNICIEN

OPERATEUR_PRODUCTION
```

Ces valeurs correspondent exactement à l'énumération du backend.

---

# Chargement du rôle

Après le Login :

```
POST /auth/login
```

Le frontend appelle :

```
GET /auth/me
```

Le rôle retourné est utilisé pour construire automatiquement l'interface.

---

# Menu Administrateur

Pages visibles

- Dashboard
- Utilisateurs
- Bancs de test
- Profil

Pages cachées

- Planning
- Mes interventions
- Déclaration d'incident
- Alertes
- Historique

---

# Menu Manager Maintenance

Pages visibles

- Dashboard
- Tickets
- Interventions
- Planning
- Historique
- Alertes
- Profil

Pages cachées

- Gestion utilisateurs
- Gestion bancs

---

# Menu Technicien

Pages visibles

- Planning
- Mes interventions
- Historique
- Profil

Pages cachées

- Dashboard
- Utilisateurs
- Bancs
- Alertes

---

# Menu Opérateur Production

Pages visibles

- Déclaration d'incident
- Profil

Pages cachées

- Dashboard
- Planning
- Utilisateurs
- Historique
- Alertes
- Interventions

---

# Accès aux pages

| Page | ADMIN | MANAGER | TECHNICIEN | OPERATEUR |
|-------|:-----:|:-------:|:----------:|:---------:|
| Login | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ❌ | ❌ |
| Utilisateurs | ✅ | ❌ | ❌ | ❌ |
| Bancs de test | ✅ | ❌ | ❌ | ❌ |
| Tickets | ❌ | ✅ | ✅* | ✅* |
| Interventions | ❌ | ✅ | ✅ | ❌ |
| Planning | ❌ | ✅ | ✅ |
| Historique | ✅ | ✅ | ✅* | ❌ |
| Alertes | ✅ | ✅ | ❌ | ❌ |
| Profil | ✅ | ✅ | ✅ | ✅ |

(*) limité aux données autorisées par le backend.

---

# Boutons visibles

## Administrateur

Peut voir :

- Nouveau
- Modifier
- Supprimer
- Export

---

## Manager

Peut voir :

- Nouveau Ticket
- Nouvelle Intervention
- Modifier
- Affecter
- Clôturer

---

## Technicien

Peut voir :

- Consulter
- Commencer intervention
- Terminer intervention

Ne voit jamais :

- Supprimer
- Affecter

---

## Opérateur

Peut voir :

- Déclarer un incident

Ne voit jamais :

- Modifier
- Supprimer
- Affecter
- Planning

---

# Routes protégées

Toutes les routes utilisent :

```
ProtectedRoute
```

Le composant vérifie :

- JWT valide
- rôle utilisateur

En cas d'échec :

```
401

↓

Login
```

ou

```
403

↓

Forbidden
```

---

# Navigation

Les menus sont construits dynamiquement.

Aucun menu ne doit être codé en dur.

Chaque entrée possède :

- titre
- icône
- route
- rôles autorisés

---

# Actions

Le frontend masque les actions non autorisées.

Exemple :

```
Supprimer utilisateur
```

visible uniquement pour :

```
ADMINISTRATEUR
```

---

# Synchronisation Backend

Le frontend ne décide jamais seul des permissions.

Même si un bouton est affiché :

le backend peut répondre :

```
403 Forbidden
```

Cette réponse doit être correctement gérée.

---

# Gestion des erreurs

401

→ redirection Login

403

→ page Forbidden

404

→ page NotFound

---

# Tests RBAC

Les tests doivent vérifier :

- affichage correct des menus
- affichage correct des boutons
- protection des routes
- redirection Login
- redirection Forbidden
- changement d'interface selon le rôle

---

# Bonnes pratiques

✔ menus dynamiques

✔ routes protégées

✔ boutons masqués selon le rôle

✔ aucune logique RBAC dupliquée

✔ utilisation d'un hook centralisé

```
usePermissions()
```

ou

```
useCurrentUser()
```

---

# Interdictions

❌ rôle écrit en dur

❌ plusieurs systèmes RBAC

❌ permissions dans les composants

❌ duplication des règles

❌ bypass du backend

---

# Références

- RBAC.md
- PERMISSIONS_MATRIX.md
- API_SPECIFICATION.md
- AUTHENTICATION.md
- FRONTEND_ARCHITECTURE.md
- FRONTEND_PAGES.md