# ARCHITECTURE.md

# Architecture du projet

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document décrit l'architecture logicielle du projet SmartMaint IA.

Il constitue la référence technique pour l'organisation du code source.

Le développement doit respecter :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- DATABASE.md
- DEVELOPMENT_RULES.md

---

# Vue générale

L'application SmartMaint IA repose sur une architecture client-serveur.

Elle est composée des éléments suivants :

- Frontend Web (React)
- Backend (Python / FastAPI)
- Modules d'Intelligence Artificielle
- Base de données MySQL

Les utilisateurs interagissent avec l'application via le frontend React.

Le frontend communique avec le backend au moyen d'une API REST.

Le backend traite les règles métier, communique avec les modules IA et accède à la base de données MySQL.

---

# Architecture logique

L'application est organisée en quatre couches principales.

## Couche Présentation

Responsabilité :

Interface utilisateur.

Technologie :

- React

Fonctions :

- Authentification
- Tableaux de bord
- Gestion des utilisateurs
- Gestion des bancs BDD
- Gestion des tickets
- Gestion des interventions
- Gestion du planning

---

## Couche Métier

Responsabilité :

Implémenter la logique métier.

Technologie :

- Python
- FastAPI

Fonctions :

- Authentification
- Gestion des utilisateurs
- Gestion des bancs BDD
- Gestion des tickets
- Gestion des interventions
- Gestion des historiques
- Gestion des plannings
- Tableau de bord

---

## Couche Intelligence Artificielle

Responsabilité :

Automatiser certaines opérations prévues dans le cahier des charges.

Modules :

- Agent Service Client
- Assistant d'Organisation
- Agent de Génération des Rapports
- Module de Maintenance Prédictive

Les modules IA sont intégrés au backend.

Ils ne constituent pas des applications indépendantes.

---

## Couche Données

Responsabilité :

Stockage des données.

Technologie :

- MySQL

Conception :

- MySQL Workbench

---

# Architecture du Backend

Le backend est organisé par responsabilités.

Structure recommandée :

```text
backend/
│
└── app/
    │
    ├── api/
    │   └── v1/
    │
    ├── config/
    │
    ├── core/
    │
    ├── database/
    │
    ├── dependencies/
    │
    ├── middleware/
    │
    ├── models/
    │
    ├── schemas/
    │
    ├── services/
    │
    ├── repositories/
    │
    ├── ai/
    │
    ├── tests/
    │
    ├── utils/
    │
    └── main.py
```

## Description

### api/

Contient les routes FastAPI.

Les routes sont versionnées dans le sous-dossier `v1/` (préfixe `/api/v1/`).

---

### config/

Paramétrage et configuration de l'application.

---

### core/

Configuration générale.

JWT

Sécurité

Variables d'environnement

---

### database/

Connexion MySQL.

Session SQLAlchemy.

---

### models/

Modèles SQLAlchemy.

---

### schemas/

Schémas Pydantic.

---

### services/

Logique métier.

---

### repositories/

Accès aux données.

---

### ai/

Modules IA.

- Agent Service Client

- Assistant d'Organisation

- Agent de Génération des Rapports

- Module de Maintenance Prédictive

---

### dependencies/

Dépendances FastAPI injectables (authentification, session de base de données, contrôle des rôles via `Depends`).

---

### middleware/

Middlewares applicatifs (CORS, gestion centralisée des erreurs, journalisation).

---

### tests/

Tests unitaires et tests d'intégration du backend.

---

### utils/

Fonctions utilitaires.

---

# Architecture du Frontend

Le frontend est développé avec React.

Structure recommandée :

```text
frontend/
│
├── src/
│
├── assets/
│
├── components/
│
├── contexts/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── routes/
│
├── services/
│
├── utils/
│
└── App.jsx
```

## Description

### components/

Composants réutilisables.

---

### layouts/

Organisation générale des pages.

---

### pages/

Pages de l'application.

- Login

- Dashboard

- Utilisateurs

- Bancs BDD

- Tickets

- Interventions

- Planning

---

### services/

Communication avec l'API REST.

---

### routes/

Gestion des routes React.

---

### contexts/

Gestion des contextes React.

---

### hooks/

Hooks personnalisés.

---

# Communication

Les échanges entre les composants suivent le flux suivant :

Utilisateur

↓

Application React

↓

API REST (FastAPI)

↓

Services métier

↓

Repositories

↓

MySQL

Les modules IA sont appelés par les services métier lorsque cela est nécessaire.

---

# Principes d'architecture

Le développement doit respecter les principes suivants :

- Séparation des responsabilités.
- Architecture modulaire.
- Réutilisation des composants.
- Faible couplage.
- Forte cohésion.
- Respect des diagrammes UML.
- Respect des workflows.
- Respect des règles métier.

---

# Règles

Ne jamais :

- modifier l'architecture sans validation ;
- créer un nouveau module sans justification ;
- contourner la couche service pour accéder directement à la base de données ;
- accéder à MySQL depuis le frontend ;
- dupliquer la logique métier.

Toujours :

- utiliser les services métier ;
- utiliser les repositories pour l'accès aux données ;
- centraliser les appels API dans le frontend ;
- respecter la structure du projet.

---

# Référence

Ce document décrit uniquement l'architecture logicielle.

Les fonctionnalités sont décrites dans :

- CAHIER_DES_CHARGES.md

Les diagrammes sont regroupés dans :

- UML.md

Les règles de développement sont définies dans :

- DEVELOPMENT_RULES.md