# RESPONSIVE_GUIDELINES.md

# SmartMaint IA

## Responsive Design Guidelines

Version : 1.0

---

# Objectif

Ce document définit les règles de conception responsive du frontend SmartMaint IA.

Toutes les pages, composants et layouts doivent respecter ces règles afin de garantir une expérience utilisateur cohérente sur tous les appareils.

Le responsive est obligatoire pour chaque nouveau développement.

---

# Philosophie

Le frontend suit une approche :

```
Desktop First
```

avec une adaptation progressive vers :

- Laptop
- Tablet
- Mobile

L'application est principalement utilisée sur ordinateur dans un contexte industriel, mais elle doit rester pleinement fonctionnelle sur tablette et mobile.

---

# Breakpoints

## Desktop XL

```
≥ 1536 px
```

Utilisation optimale des grands écrans.

---

## Desktop

```
1280 px à 1535 px
```

Format principal de développement.

---

## Laptop

```
1024 px à 1279 px
```

Réduction des espacements et adaptation des colonnes.

---

## Tablet

```
768 px à 1023 px
```

Sidebar rétractable.

Cartes empilées.

Navigation adaptée.

---

## Mobile

```
≤ 767 px
```

Interface simplifiée.

Navigation par menu.

Aucune perte de fonctionnalité.

---

# Layout

Desktop

```
Sidebar visible

Topbar fixe

Contenu centré
```

---

Tablet

```
Sidebar masquée

Menu latéral

Topbar compacte
```

---

Mobile

```
Sidebar remplacée par un Drawer

Navigation simplifiée

Une seule colonne
```

---

# Grilles

Desktop

```
4 colonnes
```

---

Laptop

```
3 colonnes
```

---

Tablet

```
2 colonnes
```

---

Mobile

```
1 colonne
```

Toutes les cartes doivent s'adapter automatiquement.

---

# Dashboard

Les cartes statistiques utilisent :

Desktop

```
4 cartes par ligne
```

Laptop

```
3 cartes
```

Tablet

```
2 cartes
```

Mobile

```
1 carte
```

---

# Tables

Desktop

Afficher toutes les colonnes.

---

Tablet

Masquer les colonnes secondaires.

---

Mobile

Utiliser :

- cartes
- accordéons
- scroll horizontal si nécessaire

Ne jamais couper les données importantes.

---

# Formulaires

Desktop

Deux colonnes lorsque possible.

---

Tablet

Deux colonnes réduites.

---

Mobile

Une seule colonne.

Tous les champs utilisent :

```
width: 100%
```

---

# Boutons

Desktop

Boutons avec texte + icône.

---

Mobile

Icône + texte court.

Taille minimale :

```
44 px
```

pour respecter les recommandations d'accessibilité.

---

# Sidebar

Desktop

Toujours visible.

---

Tablet

Rétractable.

---

Mobile

Remplacée par un Drawer ou Sheet.

---

# Topbar

Toujours visible.

Contient :

- Logo
- Nom de l'application
- Utilisateur connecté
- Notifications
- Déconnexion

Sur mobile, les éléments secondaires peuvent être regroupés dans un menu.

---

# Dialogs

Desktop

Fenêtres modales centrées.

---

Mobile

Plein écran ou presque.

---

# DataTable

Les DataTables doivent être :

- scrollables horizontalement si nécessaire ;
- lisibles sur petits écrans ;
- paginées.

---

# Cartes

Toutes les cartes utilisent :

- largeur fluide ;
- hauteur automatique ;
- marges cohérentes.

---

# Images

Toutes les images doivent être :

- responsive ;
- optimisées ;
- non déformées.

---

# Typographie

Les tailles de texte doivent s'adapter selon la largeur de l'écran.

Hiérarchie recommandée :

- H1
- H2
- H3
- Texte
- Caption

Éviter les tailles fixes lorsque ce n'est pas nécessaire.

---

# Espacements

Adapter les marges et paddings selon le breakpoint.

Utiliser les utilitaires Tailwind plutôt que des valeurs CSS personnalisées.

---

# Navigation

Toutes les fonctionnalités doivent rester accessibles.

Aucune page ne doit perdre une fonctionnalité en mode mobile.

---

# Performance

Limiter :

- les animations complexes ;
- les composants lourds ;
- les images volumineuses.

Utiliser le lazy loading lorsque cela est pertinent.

---

# Accessibilité

Respecter :

- navigation clavier ;
- focus visible ;
- contraste WCAG ;
- tailles minimales des zones cliquables.

---

# Vérifications obligatoires

Après chaque module :

- Vérifier l'affichage Desktop.
- Vérifier l'affichage Laptop.
- Vérifier l'affichage Tablet.
- Vérifier l'affichage Mobile.
- Vérifier les formulaires.
- Vérifier les tableaux.
- Vérifier les dialogues.
- Vérifier les menus.
- Vérifier les boutons.
- Vérifier les cartes.
- Vérifier les performances.

---

# Interdictions

❌ Largeurs fixes non justifiées

❌ Débordements horizontaux

❌ Éléments masqués sans alternative

❌ Texte illisible

❌ Composants non adaptatifs

❌ Fonctionnalités absentes sur mobile

---

# Bonnes pratiques

✔ Utiliser les breakpoints Tailwind CSS.

✔ Tester systématiquement sur plusieurs tailles d'écran.

✔ Concevoir les composants pour qu'ils soient réutilisables et responsives dès leur création.

✔ Garder une interface claire et cohérente avec le Design System.

---

# Références

- DESIGN_SYSTEM.md
- FRONTEND_ARCHITECTURE.md
- COMPONENT_LIBRARY.md
- FRONTEND_DEVELOPMENT_RULES.md