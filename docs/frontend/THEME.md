# THEME.md

# SmartMaint IA

## Frontend Theme Specification

Version : 1.0

---

# Objectif

Ce document définit le thème graphique officiel du frontend SmartMaint IA.

Il constitue la référence unique pour :

- Tailwind CSS
- shadcn/ui
- Uiverse
- Recharts
- Lucide React
- Tous les composants React

Aucun style ne doit être ajouté sans respecter ce document.

---

# Inspiration

Le design est inspiré du site officiel :

https://www.sagemcom.com/fr

L'objectif est de retrouver :

- une interface industrielle
- un design B2B moderne
- beaucoup d'espace blanc
- une excellente lisibilité
- des cartes épurées
- une hiérarchie visuelle claire
- des couleurs sobres

Le design ne doit jamais être une copie.

Il s'agit d'une adaptation moderne utilisant Tailwind CSS et shadcn/ui.

---

# Technologies UI

Le frontend utilise exclusivement :

- Tailwind CSS
- shadcn/ui
- Uiverse
- Lucide React
- Recharts

Ces bibliothèques constituent la base officielle de tous les composants.

---

# Philosophie

Le frontend doit transmettre :

✔ fiabilité

✔ robustesse

✔ modernité

✔ simplicité

✔ performance

✔ industrie

---

# Palette officielle

## Primary

```
50   #EFF6FF
100  #DBEAFE
200  #BFDBFE
300  #93C5FD
400  #60A5FA
500  #2563EB
600  #1D4ED8
700  #1E40AF
800  #1E3A8A
900  #172554
```

---

## Neutral

```
50   #FAFAFA
100  #F5F5F5
200  #E5E5E5
300  #D4D4D4
400  #A3A3A3
500  #737373
600  #525252
700  #404040
800  #262626
900  #171717
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#EF4444
```

---

## Info

```
#3B82F6
```

---

# Typography

Police principale

```
Inter
```

Fallback

```
sans-serif
```

---

## Font Sizes

Display

```
48px
```

Heading 1

```
36px
```

Heading 2

```
30px
```

Heading 3

```
24px
```

Heading 4

```
20px
```

Body

```
16px
```

Small

```
14px
```

Caption

```
12px
```

---

# Border Radius

Small

```
8px
```

Medium

```
12px
```

Large

```
16px
```

Extra Large

```
20px
```

---

# Shadows

Cards

```
shadow-sm
```

Dialogs

```
shadow-md
```

Hover

```
shadow-lg
```

Les ombres doivent rester discrètes.

---

# Borders

Color

```
Gray-200
```

Width

```
1px
```

---

# Spacing

XS

```
4px
```

S

```
8px
```

M

```
16px
```

L

```
24px
```

XL

```
32px
```

XXL

```
48px
```

---

# Buttons

## Primary

Background

Primary 600

Hover

Primary 700

Text

White

---

## Secondary

Background

White

Border

Gray-300

Hover

Gray-50

---

## Danger

Background

Red

---

## Ghost

Transparent

---

Tous les boutons utilisent :

- radius 12px
- hauteur uniforme
- transition 150ms

---

# Cards

Toutes les cartes utilisent :

Background

White

Radius

12px

Border

Gray-200

Padding

24px

Shadow

shadow-sm

---

# Sidebar

Background

White

Width

280px

Border Right

Gray-200

Active Menu

Primary-600

Hover

Gray-100

Icons

Lucide React

---

# Topbar

Height

72px

Background

White

Border Bottom

Gray-200

Shadow

shadow-sm

---

# Dashboard

Les statistiques utilisent :

- Metric Cards
- Charts
- Recent Activity

Chaque carte possède :

- Icône
- Valeur
- Description

Les graphiques utilisent :

Recharts

---

# Forms

Tous les formulaires utilisent :

shadcn/ui

Composants :

- Input
- Select
- Textarea
- Checkbox
- Radio
- Switch

Validation :

React Hook Form

+

Zod

---

# Tables

Toutes les listes utilisent :

DataTable

Les tableaux possèdent :

- recherche
- pagination
- tri
- filtres
- actions

---

# Icons

Bibliothèque unique :

Lucide React

Aucune autre bibliothèque d'icônes n'est autorisée.

---

# Utilisation de shadcn/ui

Tous les composants métier doivent utiliser shadcn/ui.

Exemples :

- Button
- Input
- Card
- Dialog
- AlertDialog
- Table
- Badge
- Dropdown Menu
- Tabs
- Sheet
- Drawer
- Pagination
- Tooltip
- Skeleton

---

# Utilisation de Uiverse

Uiverse est utilisé uniquement pour améliorer l'expérience utilisateur.

Les composants doivent être adaptés au thème SmartMaint IA avant utilisation.

Utilisations autorisées :

- Login Card
- Animated Login Background
- Loader
- Skeleton
- Empty State
- Search Bar
- Hover Cards
- Progress Indicators
- Toggle
- Switch
- Animated Buttons
- Micro-interactions

Les composants Uiverse ne doivent jamais remplacer les composants métier de shadcn/ui.

---

# Priorité des composants

Toujours respecter l'ordre suivant :

1. shadcn/ui

↓

2. Uiverse (uniquement pour améliorer l'esthétique)

↓

3. Développement personnalisé uniquement si nécessaire.

---

# Animations

Animations autorisées

- Fade
- Slide
- Hover
- Scale léger
- Ripple discret

Durée maximale

```
150ms
```

Animations interdites

- Bounce
- Rotate
- Flip
- Neon
- Glitch
- 3D
- Long animations
- Particles

---

# Responsive

Le thème fonctionne sur :

- Desktop
- Laptop
- Tablet
- Mobile

Voir :

RESPONSIVE_GUIDELINES.md

---

# Accessibilité

Toutes les interfaces doivent respecter :

- WCAG AA
- Focus visible
- Navigation clavier
- Contraste suffisant
- Zones cliquables ≥ 44px

---

# Dark Mode

Non prévu dans cette version.

Le thème doit néanmoins permettre son ajout futur.

---

# Tailwind

Toutes les couleurs, rayons, espacements et ombres doivent être définis dans :

```
tailwind.config.ts
```

Aucun composant ne doit contenir de couleurs codées en dur.

---

# Interdictions

❌ Copier directement le design de Sagemcom

❌ Utiliser plusieurs styles de boutons

❌ Utiliser plusieurs styles de cartes

❌ Ajouter des couleurs non documentées

❌ Utiliser Bootstrap

❌ Utiliser Material UI

❌ Utiliser Ant Design

❌ Utiliser Chakra UI

❌ Ajouter du CSS inline

---

# Bonnes pratiques

✔ Interface industrielle

✔ Design sobre

✔ Composants réutilisables

✔ Cohérence graphique

✔ Responsive

✔ Performance

✔ Accessibilité

✔ Utilisation prioritaire de shadcn/ui

✔ Uiverse uniquement pour enrichir l'expérience utilisateur

---

# Références

- DESIGN_SYSTEM.md
- UI_GUIDELINES.md
- COMPONENT_LIBRARY.md
- RESPONSIVE_GUIDELINES.md
- FRONTEND_ARCHITECTURE.md