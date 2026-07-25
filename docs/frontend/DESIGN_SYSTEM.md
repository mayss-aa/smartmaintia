# DESIGN_SYSTEM.md

# SmartMaint IA

## Frontend Design System

Version : 1.0

---

# Objectif

Ce document définit les règles visuelles officielles du frontend SmartMaint IA.

Toutes les pages, composants et futurs développements doivent respecter ce Design System.

Le but est d'obtenir une interface :

- moderne
- professionnelle
- industrielle
- cohérente
- sobre
- facilement maintenable

---

# Inspiration

Le design est inspiré de :

Sagemcom

https://www.sagemcom.com/fr

Il ne s'agit PAS de copier leur identité graphique.

Le frontend doit uniquement reprendre leur philosophie :

- interface claire
- beaucoup d'espace blanc
- peu d'effets
- hiérarchie visuelle forte
- design industriel
- composants simples

---

# Stack UI

Le frontend utilise uniquement :

- Tailwind CSS

- shadcn/ui

- Uiverse

- Lucide React

---

# Philosophie

Le design doit privilégier :

✔ simplicité

✔ lisibilité

✔ efficacité

✔ cohérence

✔ accessibilité

Le design ne doit jamais être :

❌ futuriste

❌ cyberpunk

❌ gaming

❌ surchargé

❌ rempli d'animations

---

# Palette de couleurs

## Couleur principale

Bleu industriel

```
#005AA9
```

---

## Couleur secondaire

Bleu clair

```
#3B82F6
```

---

## Fond principal

```
#F8FAFC
```

---

## Surface

```
#FFFFFF
```

---

## Bordures

```
#E5E7EB
```

---

## Texte principal

```
#111827
```

---

## Texte secondaire

```
#6B7280
```

---

# Couleurs métier

Succès

```
#22C55E
```

---

Attention

```
#F59E0B
```

---

Erreur

```
#EF4444
```

---

Information

```
#3B82F6
```

---

# Typographie

Police principale

```
Inter
```

Fallback

```
sans-serif
```

---

Titres

```
font-weight

700
```

---

Sous-titres

```
600
```

---

Texte

```
400
```

---

# Espacements

Petit

```
8 px
```

Moyen

```
16 px
```

Grand

```
24 px
```

Très grand

```
32 px
```

Les espacements doivent être réguliers dans toute l'application.

---

# Radius

Petits composants

```
8 px
```

Cards

```
12 px
```

Dialogs

```
16 px
```

---

# Ombres

Très discrètes.

Jamais d'ombres importantes.

Utiliser uniquement :

```
shadow-sm

shadow-md
```

---

# Icônes

Bibliothèque officielle :

Lucide React

Aucune autre bibliothèque.

---

# Boutons

Primaire

Bleu

Secondaire

Blanc

Danger

Rouge

Toujours :

- hauteur identique

- largeur automatique

- icône facultative

---

# Cards

Toutes les cartes utilisent :

- fond blanc

- bordure grise

- radius

- padding

- légère ombre

---

# Formulaires

Tous les formulaires utilisent :

React Hook Form

+

Zod

Les composants proviennent de :

shadcn/ui

---

# Tables

Toutes les tables utilisent :

DataTable

Fonctionnalités :

- tri

- pagination

- recherche

- responsive

---

# Dashboard

Le Dashboard utilise :

MetricCard

ChartCard

DataTable

StatusBadge

Jamais plus de 4 cartes par ligne.

---

# Sidebar

Toujours visible sur Desktop.

Rétractable.

Icônes Lucide.

Menu selon le rôle utilisateur.

---

# Topbar

Contient :

- utilisateur connecté

- notifications

- déconnexion

---

# Responsive

Desktop

≥ 1280 px

---

Laptop

1024 px

---

Tablet

768 px

---

Mobile

480 px

Toutes les pages doivent fonctionner sur ces tailles.

---

# Animations

Très discrètes.

Autorisées :

- fade

- slide

- hover

Interdites :

❌ rotation

❌ effets 3D

❌ animations longues

---

# Uiverse

Uiverse est autorisé uniquement pour :

- Login

- Loader

- Empty State

- boutons

- animations légères

Les composants métier proviennent de shadcn/ui.

---

# Accessibilité

Tous les composants doivent respecter :

- contraste WCAG

- focus clavier

- aria-label

- navigation clavier

- labels

---

# Cohérence

Tous les modules doivent utiliser :

- mêmes couleurs

- mêmes marges

- mêmes cartes

- mêmes boutons

- mêmes tables

- mêmes formulaires

---

# Pages

Toutes les pages utilisent :

AppLayout

Sidebar

Topbar

PageHeader

DataTable

Modal

Toast

Loader

---

# Interdictions

❌ plusieurs styles de boutons

❌ plusieurs DataTable

❌ plusieurs palettes

❌ plusieurs Sidebars

❌ composants différents pour une même fonction

❌ couleurs aléatoires

❌ logique métier dans les composants

---

# Références

- FRONTEND_ARCHITECTURE.md

- COMPONENT_LIBRARY.md

- UI_GUIDELINES.md

- FRONTEND_DEVELOPMENT_RULES.md