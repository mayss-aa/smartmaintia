# FRONTEND_DEVELOPMENT_RULES.md

# SmartMaint IA

## Frontend Development Rules

Version : 1.0

---

# Objectif

Ce document définit les règles obligatoires de développement du frontend SmartMaint IA.

Tous les développements React doivent respecter ces règles sans exception.

Ces règles garantissent :

- une architecture cohérente ;
- un code maintenable ;
- une interface homogène ;
- une intégration fiable avec le backend FastAPI.

---

# Règles générales

Le développement suit une approche incrémentale.

Chaque module doit être entièrement terminé avant de commencer le suivant.

Aucun développement parallèle.

---

# Ordre de développement

Toujours respecter :

```
FRONTEND_BACKLOG.md
```

Ne jamais développer un module non planifié.

---

# Documentation

Avant chaque module :

- lire la documentation concernée ;
- vérifier les API disponibles ;
- vérifier le RBAC ;
- vérifier les composants existants.

---

# Développement

Chaque module comprend :

- pages
- composants
- hooks
- services
- types
- validations
- tests

Un module n'est jamais considéré terminé tant que tous ces éléments ne sont pas réalisés.

---

# Architecture

Respecter strictement :

- FRONTEND_ARCHITECTURE.md
- FOLDER_STRUCTURE.md

Ne jamais créer une nouvelle architecture.

---

# API

Toutes les requêtes passent exclusivement par :

```
services/
```

Interdictions :

❌ fetch()

❌ axios directement dans les pages

❌ appels HTTP dans les composants

Toujours utiliser :

```
Axios

+

TanStack Query
```

---

# Authentification

Toutes les routes protégées utilisent :

- JWT
- ProtectedRoute
- RBAC

Voir :

```
AUTHENTICATION.md
```

---

# Formulaires

Tous les formulaires utilisent :

- React Hook Form
- Zod

Aucune validation manuelle.

---

# Composants

Créer uniquement des composants réutilisables.

Avant d'en créer un nouveau :

vérifier s'il existe déjà.

Interdictions :

❌ plusieurs DataTable

❌ plusieurs Sidebar

❌ plusieurs Modal

❌ plusieurs Loader

---

# UI

Respecter strictement :

```
DESIGN_SYSTEM.md
```

Le frontend est inspiré de :

Sagemcom

Utiliser :

- Tailwind CSS
- shadcn/ui
- Uiverse

Aucun autre framework UI.

---

# Icônes

Utiliser uniquement :

Lucide React

---

# Responsive

Toutes les pages doivent fonctionner sur :

- Desktop
- Laptop
- Tablet
- Mobile

Aucun écran desktop-only.

---

# Accessibilité

Toutes les pages respectent :

- navigation clavier
- focus visible
- aria-label
- contraste WCAG

---

# TypeScript

Mode strict obligatoire.

Interdictions :

❌ any

❌ ts-ignore

❌ code non typé

---

# Gestion des données

Toutes les données serveur utilisent :

TanStack Query

Ne jamais utiliser :

```
useEffect

+

Axios
```

pour charger les données.

---

# État global

Utiliser un store uniquement pour :

- authentification
- thème (si nécessaire)

Les données métier restent dans TanStack Query.

---

# Tests

Après chaque module :

- compilation
- lint
- typage TypeScript
- tests unitaires
- tests d'intégration
- vérification responsive
- vérification RBAC

Le module ne peut être validé que si tous les tests passent.

---

# Rapport obligatoire

À la fin de chaque module, produire un rapport contenant :

- résumé du module ;
- fichiers créés ;
- fichiers modifiés ;
- composants créés ;
- hooks créés ;
- services créés ;
- API consommées ;
- routes ajoutées ;
- tests exécutés ;
- résultats des tests ;
- vérification du responsive ;
- vérification RBAC ;
- problèmes rencontrés ;
- solutions apportées.

---

# Passage au module suivant

Si le module est validé :

- mettre à jour le backlog ;
- passer automatiquement au module suivant.

Ne pas attendre une confirmation, sauf si une ambiguïté documentaire ou un blocage technique est détecté.

---

# Ambiguïtés

Si une incohérence est détectée entre :

- API_SPECIFICATION.md
- RBAC.md
- PERMISSIONS_MATRIX.md
- ERD.md
- FRONTEND_PAGES.md

Arrêter immédiatement le développement.

Produire un rapport détaillé.

Ne jamais inventer une règle métier.

---

# IA

Ne développer aucun module IA.

Ne créer que les emplacements nécessaires si prévus dans la documentation.

Aucune logique IA.

Aucun LLM.

Aucun RAG.

Aucun LangChain.

Aucun MCP.

---

# Interdictions

❌ logique métier dans les composants

❌ duplication de code

❌ duplication de composants

❌ CSS inline inutile

❌ appels API directs

❌ création de pages non documentées

❌ création de routes non documentées

❌ modification du backend

❌ ajout d'API backend

---

# Références

- FRONTEND_ARCHITECTURE.md
- FOLDER_STRUCTURE.md
- DESIGN_SYSTEM.md
- COMPONENT_LIBRARY.md
- API_CONSUMPTION.md
- AUTHENTICATION.md
- FRONTEND_RBAC.md
- FRONTEND_BACKLOG.md
- API_SPECIFICATION.md
- RBAC.md
- PERMISSIONS_MATRIX.md