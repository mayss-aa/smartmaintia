# TESTING.md

# SmartMaint IA

## Frontend Testing Strategy

Version : 1.0

---

# Objectif

Ce document définit la stratégie officielle de tests du frontend SmartMaint IA.

Chaque fonctionnalité développée doit être testée avant d'être considérée comme terminée.

Le frontend utilise trois niveaux de tests :

- Tests unitaires
- Tests d'intégration
- Tests End-to-End

---

# Technologies

## Tests unitaires

- Vitest

---

## Tests React

- React Testing Library

---

## Tests End-to-End

- Playwright

---

# Architecture

```
Component

↓

Unit Test

↓

Integration Test

↓

End-to-End Test
```

---

# Organisation

```
tests/

unit/

integration/

e2e/

fixtures/

mocks/

utils/
```

---

# Unit Tests

Les tests unitaires vérifient :

- composants
- hooks
- helpers
- utils
- validations Zod

Ils ne doivent jamais appeler le backend.

Toutes les dépendances sont mockées.

---

# Composants à tester

- Sidebar

- Topbar

- DataTable

- Modal

- Loader

- MetricCard

- StatusBadge

- Toast

- EmptyState

- ConfirmDialog

- ProtectedRoute

---

# Hooks à tester

- useLogin

- useLogout

- useCurrentUser

- useUsers

- useDashboard

- useTickets

- useInterventions

- usePlanning

- useHistory

- useAlerts

---

# Services

Les services Axios doivent être testés.

Les appels HTTP sont mockés.

Les tests vérifient :

- succès

- erreur

- timeout

- JWT

- erreurs réseau

---

# Integration Tests

Les tests d'intégration vérifient :

- pages

- formulaires

- navigation

- React Query

- AuthContext

- ProtectedRoute

- interactions utilisateur

Le backend est simulé.

---

# Pages à tester

Login

Dashboard

Users

Test Benches

Tickets

Interventions

Planning

History

Alerts

Incident Declaration

Profile

---

# Scénarios

Login réussi

↓

Dashboard

---

Login refusé

↓

Message d'erreur

---

Création utilisateur

↓

Table mise à jour

---

Suppression utilisateur

↓

Confirmation

↓

Liste actualisée

---

Déclaration incident

↓

Ticket créé

---

Planning

↓

Liste affichée

---

Historique

↓

Lecture seule

---

Alertes

↓

Lecture seule

---

Dashboard

↓

Toutes les cartes affichées

---

# End-to-End

Les tests Playwright utilisent le backend réel.

Ils vérifient :

- frontend

- backend

- JWT

- RBAC

- API

- navigation

---

# Parcours utilisateur

## Administrateur

Connexion

↓

Dashboard

↓

Utilisateurs

↓

CRUD

↓

Bancs

↓

CRUD

↓

Déconnexion

---

## Manager

Connexion

↓

Dashboard

↓

Tickets

↓

Interventions

↓

Planning

↓

Historique

↓

Alertes

↓

Déconnexion

---

## Technicien

Connexion

↓

Planning

↓

Mes interventions

↓

Historique

↓

Déconnexion

---

## Opérateur

Connexion

↓

Déclaration incident

↓

Déconnexion

---

# RBAC

Les tests vérifient :

- menus

- routes

- boutons

- actions

- composants

selon le rôle.

---

# Responsive

Tous les scénarios Playwright sont exécutés sur :

Desktop

Laptop

Tablet

Mobile

---

# Performance

Les tests vérifient :

- temps de chargement

- navigation

- lazy loading

- absence de blocage

---

# Accessibilité

Les composants doivent être testés pour :

- navigation clavier

- focus

- labels

- contrastes

---

# Mocking

Toutes les requêtes HTTP sont mockées avec :

- Mock Service Worker (MSW)

ou

- Vitest mocks

Le choix doit être cohérent dans tout le projet.

---

# Couverture

Objectif minimum :

| Élément | Couverture |
|---------|-----------:|
| Components | 90% |
| Hooks | 90% |
| Services | 95% |
| Utils | 95% |
| Pages | 80% |

---

# Validation d'un module

Un module est terminé uniquement si :

- il compile sans erreur ;
- le lint passe ;
- TypeScript ne signale aucune erreur ;
- tous les tests unitaires passent ;
- tous les tests d'intégration passent ;
- les scénarios End-to-End passent ;
- le responsive est validé ;
- le RBAC est conforme ;
- l'intégration backend est fonctionnelle.

---

# Rapport obligatoire

À la fin de chaque module, produire un rapport contenant :

- nombre de tests exécutés ;
- nombre de tests réussis ;
- nombre de tests échoués ;
- couverture ;
- captures Playwright (si disponibles) ;
- problèmes détectés ;
- corrections apportées.

---

# Interdictions

❌ Tester directement Axios dans les composants

❌ Ignorer les erreurs TypeScript

❌ Désactiver un test sans justification

❌ Utiliser des données de production

❌ Développer une fonctionnalité sans tests

---

# Références

- FRONTEND_ARCHITECTURE.md
- API_CONSUMPTION.md
- AUTHENTICATION.md
- FRONTEND_RBAC.md
- FRONTEND_BACKLOG.md
- FRONTEND_DEVELOPMENT_RULES.md