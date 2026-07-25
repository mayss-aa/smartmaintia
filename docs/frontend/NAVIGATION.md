# NAVIGATION.md

# SmartMaint IA

## Navigation Specification

Version : 1.0

---

# Objectif

Définir la navigation officielle du frontend SmartMaint IA.

La navigation doit être simple, cohérente et adaptée au rôle de l'utilisateur.

---

# Architecture

```
AppLayout

│

├── Sidebar

├── Topbar

└── Main Content
```

---

# Sidebar

Toujours présente sur Desktop.

Rétractable.

Contient :

- Logo SmartMaint IA
- Menu
- Version
- Profil utilisateur

---

# Topbar

Contient :

- Breadcrumb
- Barre de recherche (future évolution)
- Notifications (future évolution)
- Avatar
- Nom utilisateur
- Déconnexion

---

# Breadcrumb

Exemple :

```
Dashboard

>

Tickets

>

Détail
```

Toutes les pages protégées affichent un Breadcrumb.

---

# Menus

## ADMINISTRATEUR

- Dashboard
- Utilisateurs
- Bancs de test
- Profil

---

## MANAGER_MAINTENANCE

- Dashboard
- Tickets
- Interventions
- Planning
- Historique
- Alertes
- Profil

---

## TECHNICIEN

- Planning
- Mes interventions
- Historique
- Profil

---

## OPERATEUR_PRODUCTION

- Déclaration d'incident
- Profil

---

# Navigation dynamique

Le menu est généré à partir d'une configuration centralisée.

Chaque entrée possède :

- id
- titre
- icône
- route
- rôles autorisés

---

# Expérience utilisateur

Après connexion :

ADMINISTRATEUR

→ Dashboard

MANAGER

→ Dashboard

TECHNICIEN

→ Planning

OPERATEUR

→ Déclaration d'incident

---

# Navigation mobile

Sidebar remplacée par un Drawer.

Le contenu reste identique.

---

# États de navigation

Le menu actif est mis en évidence :

- couleur primaire
- fond léger
- barre verticale à gauche

---

# Icônes

Toutes les icônes proviennent de Lucide React.

---

# Footer Sidebar

Afficher :

- Version
- Copyright
- Nom de l'application

---

# Raccourcis

Prévoir une architecture permettant d'ajouter ultérieurement :

- favoris
- derniers écrans visités
- recherche globale

Sans modifier la structure actuelle.

---

# Vérifications

Après chaque module :

- Vérifier les routes.
- Vérifier les menus.
- Vérifier le rôle utilisateur.
- Vérifier les Breadcrumbs.
- Vérifier la navigation mobile.
- Vérifier les redirections.

---

# Références

- ROUTING.md
- FRONTEND_RBAC.md
- FRONTEND_ARCHITECTURE.md
- DESIGN_SYSTEM.md