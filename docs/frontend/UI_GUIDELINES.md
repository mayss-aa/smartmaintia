# UI_GUIDELINES.md

# SmartMaint IA

## User Interface Guidelines

Version : 1.0

---

# Objectif

Ce document décrit les règles de conception des interfaces utilisateur.

Le Design System définit les composants.

Ce document explique comment les utiliser pour construire les écrans.

Toutes les interfaces doivent être :

- cohérentes
- simples
- professionnelles
- modernes
- inspirées du style industriel de Sagemcom

---

# Inspiration

Le design s'inspire du site officiel :

https://www.sagemcom.com/fr

L'objectif est de retrouver :

- beaucoup d'espace blanc
- une hiérarchie visuelle claire
- une interface sobre
- peu de couleurs
- peu d'animations
- des composants simples

Le site ne doit jamais être copié.

---

# Technologies

Le frontend utilise uniquement :

- Tailwind CSS
- shadcn/ui
- Uiverse
- Lucide React

---

# Principes de conception

Chaque page doit être :

✔ simple

✔ lisible

✔ rapide

✔ homogène

✔ responsive

✔ accessible

---

# Hiérarchie

Chaque page possède toujours :

```
AppLayout

↓

Topbar

↓

Breadcrumb

↓

Page Header

↓

Content

↓

Footer (si nécessaire)
```

---

# Titres

Chaque page commence par :

```
Titre

Description

Actions
```

Exemple :

```
Gestion des utilisateurs

Créer, modifier et supprimer les utilisateurs.

[Nouveau]
```

---

# Cartes

Toutes les informations importantes sont affichées dans des Cards.

Les Cards utilisent :

- fond blanc
- bordure légère
- ombre discrète
- radius uniforme

---

# Boutons

Les boutons suivent une hiérarchie.

## Primaire

Bleu

Utilisé pour :

- créer
- enregistrer
- confirmer

---

## Secondaire

Blanc

Utilisé pour :

- retour
- annuler

---

## Danger

Rouge

Utilisé uniquement pour :

- suppression

---

# Icônes

Utiliser exclusivement :

Lucide React

Chaque action importante possède une icône.

---

# Formulaires

Tous les formulaires utilisent :

- Card
- Labels
- Inputs
- Messages d'erreur
- Boutons alignés

Les champs sont espacés régulièrement.

---

# Tables

Toutes les listes utilisent :

DataTable

Chaque table possède :

- recherche
- pagination
- tri
- filtres
- actions

---

# Dashboard

Le Dashboard contient uniquement :

- MetricCards
- Graphiques
- Tableaux récents

Éviter de surcharger la page.

---

# Sidebar

Toujours :

- compacte
- lisible
- icônes Lucide
- menus selon le rôle

Les menus non autorisés ne doivent jamais être affichés.

---

# Topbar

Contient :

- logo
- titre
- utilisateur
- notifications
- déconnexion

---

# Notifications

Toutes les notifications utilisent :

Toast

Types :

- succès
- erreur
- information
- avertissement

---

# États de l'interface

Chaque page doit gérer :

- chargement
- erreur
- vide
- succès

Composants :

- Loader
- ErrorState
- EmptyState
- Toast

---

# Animations

Animations très discrètes.

Autorisées :

- fade
- slide
- hover

Interdites :

- rotation
- effets 3D
- animations longues
- animations décoratives

---

# Responsive

Toutes les pages fonctionnent sur :

- Desktop
- Laptop
- Tablet
- Mobile

Voir :

```
RESPONSIVE_GUIDELINES.md
```

---

# Accessibilité

Toutes les interfaces respectent :

- navigation clavier
- focus visible
- contraste WCAG
- aria-label
- tailles minimales des zones cliquables

---

# Cohérence

Tous les modules utilisent :

- les mêmes composants
- les mêmes couleurs
- les mêmes marges
- les mêmes boutons
- les mêmes formulaires
- les mêmes tableaux

Aucun style spécifique ne doit être créé pour un seul écran.

---

# Interdictions

❌ couleurs aléatoires

❌ composants dupliqués

❌ animations excessives

❌ plusieurs styles de boutons

❌ plusieurs styles de cartes

❌ plusieurs styles de formulaires

❌ CSS spécifique lorsqu'un composant existe déjà

---

# Vérifications

Avant de valider une page :

- Respect du Design System
- Responsive
- Accessibilité
- Cohérence avec les autres pages
- Respect du RBAC
- Intégration correcte avec le backend

---

# Références

- DESIGN_SYSTEM.md
- COMPONENT_LIBRARY.md
- FRONTEND_ARCHITECTURE.md
- RESPONSIVE_GUIDELINES.md
- FRONTEND_DEVELOPMENT_RULES.md