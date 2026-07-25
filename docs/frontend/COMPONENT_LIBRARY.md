# COMPONENT_LIBRARY.md

# SmartMaint IA

## Component Library

Version : 1.0

---

# Objectif

Ce document décrit tous les composants React réutilisables du frontend.

Aucun composant métier ne doit être recréé plusieurs fois.

Tous les modules doivent réutiliser cette bibliothèque.

---

# Technologies

Les composants utilisent exclusivement :

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Uiverse
- Lucide React

---

# Organisation

```
src/

components/

    layout/

    navigation/

    dashboard/

    table/

    forms/

    feedback/

    common/

    ui/
```

---

# Layout Components

## AppLayout

Responsabilités

- structure générale

- Sidebar

- Topbar

- contenu

Utilisé par :

Toutes les pages protégées.

---

## Sidebar

Responsabilités

- navigation

- menu

- icônes

- rôle utilisateur

Le contenu change selon le RBAC.

---

## Topbar

Responsabilités

- informations utilisateur

- notifications

- bouton déconnexion

- thème

---

# Navigation

## ProtectedRoute

Responsabilités

- vérifier JWT

- vérifier RBAC

- rediriger Login

- rediriger Forbidden

Aucune page protégée ne doit être accessible sans ce composant.

---

## Breadcrumb

Responsabilités

Afficher le chemin courant.

Exemple

```
Dashboard

>

Tickets

>

Détail
```

---

# Dashboard Components

## MetricCard

Affiche :

- icône

- valeur

- titre

- couleur

Exemples :

```
Nombre utilisateurs

Nombre tickets

Nombre interventions

Nombre alertes
```

---

## DashboardSection

Bloc regroupant plusieurs cartes.

---

## ChartCard

Conteneur des graphiques.

Le graphique lui-même utilise Recharts.

---

# Table Components

## DataTable

Composant générique.

Fonctionnalités :

- pagination

- tri

- recherche

- actions

- responsive

Toutes les listes du projet utilisent DataTable.

---

## TableToolbar

Contient :

- recherche

- filtres

- export

- création

---

## SearchBar

Recherche texte.

Utilisé dans :

- Users

- Bancs

- Tickets

- Interventions

---

## Pagination

Responsabilités

- page suivante

- précédente

- taille page

Compatible backend :

```
skip

limit
```

---

## StatusBadge

Affiche les états.

Exemples

```
OUVERT

EN_COURS

TERMINE

OPERATIONNEL

EN_PANNE
```

Couleurs normalisées.

---

# Form Components

## FormField

Champ générique.

Compatible

React Hook Form.

---

## FormSection

Bloc visuel de formulaire.

---

## SubmitButton

Bouton d'envoi.

Gestion automatique :

- loading

- disabled

- succès

---

## CancelButton

Retour.

---

# Dialog Components

## Modal

Fenêtre générique.

Utilisée pour :

- détails

- édition

- création

---

## ConfirmDialog

Confirmation.

Exemple :

```
Supprimer utilisateur ?

Supprimer ticket ?

Supprimer banc ?
```

---

# Feedback Components

## Toast

Notifications.

Types :

```
Success

Error

Warning

Info
```

---

## Loader

Chargement.

Style inspiré de Uiverse.

Utilisé par React Query.

---

## EmptyState

Affiché lorsqu'aucune donnée n'existe.

Exemple

```
Aucun ticket.

Aucun utilisateur.

Aucun banc.
```

---

## ErrorState

Erreur de chargement.

---

## Forbidden

Erreur 403.

---

## NotFound

Erreur 404.

---

# Common Components

## Avatar

Utilisateur connecté.

---

## UserMenu

Menu profil.

---

## PageHeader

Titre.

Sous-titre.

Actions.

---

## ActionButton

Bouton principal.

Style Sagemcom.

---

## FilterPanel

Filtres avancés.

---

## StatisticsCard

Carte statistique.

Réutilisée dans Dashboard.

---

# UI Components

Les composants provenant de shadcn/ui sont autorisés :

- Button

- Input

- Select

- Dialog

- Table

- Sheet

- Tabs

- Card

- Badge

- Alert

- Dropdown

- Tooltip

- Popover

---

# Uiverse

Uiverse est utilisé uniquement pour :

- Login

- Loader

- Empty State

- Boutons spéciaux

- Animations légères

Il ne doit jamais remplacer les composants métier.

---

# Icônes

Bibliothèque :

Lucide React

Aucune autre bibliothèque n'est autorisée.

---

# Responsive

Tous les composants doivent fonctionner sur :

Desktop

Tablet

Mobile

---

# Accessibilité

Tous les composants doivent respecter :

- navigation clavier

- labels

- aria-label

- contraste

- focus visible

---

# Interdictions

❌ créer plusieurs DataTable

❌ créer plusieurs Modal

❌ créer plusieurs Sidebar

❌ logique métier dans les composants

❌ appels API dans les composants

---

# Références

- FRONTEND_ARCHITECTURE.md

- UI_GUIDELINES.md

- FRONTEND_DEVELOPMENT_RULES.md

- API_CONSUMPTION.md