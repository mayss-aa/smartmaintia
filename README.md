# SmartMaint IA
### Intelligent Predictive Maintenance Management Platform

SmartMaint IA est une plateforme de gestion intelligente de la maintenance industrielle développée dans une architecture moderne orientée API. Le projet combine les principes du génie logiciel, de l'intelligence artificielle, de la sécurité, de la qualité logicielle et des architectures Cloud afin de digitaliser le cycle de vie des opérations de maintenance.

L'objectif est de fournir une plateforme capable de centraliser les tickets, les interventions, le planning, les alertes prédictives, les tableaux de bord et les décisions métier tout en préparant l'intégration de services d'intelligence artificielle.

---

# Architecture

```
                    React + Vite
                           │
                           │ HTTPS
                           ▼
                  FastAPI REST API
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
 Authentication        Business Layer      AI Layer
   JWT + RBAC            Services        Prediction Engine
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                     SQLAlchemy ORM
                           │
                      PostgreSQL
```

Le projet suit une architecture en couches favorisant la maintenabilité, la testabilité et l'évolutivité.

---

# Principales fonctionnalités

## Gestion des utilisateurs

- Authentification JWT
- Gestion des rôles (RBAC)
- Gestion des permissions
- Gestion des profils

---

## Gestion des tickets

- Création
- Affectation
- Priorisation
- Historique complet

---

## Gestion des interventions

- Création
- Validation
- Suivi
- Changement de statut
- Historique des interventions

---

## Gestion des bancs de test

- CRUD complet
- Disponibilité
- Affectation

---

## Planning

- Planning des techniciens
- Disponibilités
- Charge de travail
- Vue calendrier

---

## Tableau de bord

- KPIs
- Statistiques
- Graphiques
- Activité récente

---

## Historique

Toutes les actions importantes sont journalisées.

---

## Alertes prédictives

Le backend intègre une couche permettant de produire des alertes prédictives sur les équipements.

Cette couche prépare l'intégration future d'algorithmes IA.

---

# Intelligence Artificielle

Le projet est conçu pour accueillir plusieurs modules IA.

Architecture prévue :

```
Utilisateur
      │
      ▼
Backend FastAPI
      │
      ▼
AI Service
      │
 ┌───────────────┐
 │ Prediction    │
 │ Classification│
 │ Recommendation│
 │ RAG           │
 └───────────────┘
```

Les évolutions prévues comprennent :

- Maintenance prédictive
- Détection d'anomalies
- Classification automatique des tickets
- Estimation du temps d'intervention
- Recommandation des techniciens
- Assistant conversationnel
- RAG sur la documentation technique
- Agents IA spécialisés

---

# Technologies

## Backend

- Python 3
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT
- OAuth2
- Uvicorn

---

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Router

---

## Base de données

- PostgreSQL

---

## Tests

- Pytest
- Playwright
- React Testing Library

---

## Outils

- Git
- GitHub
- OpenAPI
- Swagger
- VS Code

---

# Structure du projet

```
SmartMaint-IA/

├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── config/
│   │   ├── core/
│   │   ├── database/
│   │   ├── dependencies/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── tests/
│   └── package.json
│
└── docs/
```

---

# Architecture Backend

Le backend applique une architecture inspirée du Clean Architecture.

```
API
 │
 ▼
Services
 │
 ▼
Repositories
 │
 ▼
Database
```

Chaque couche possède une responsabilité unique.

- API : exposition REST
- Services : logique métier
- Repository : accès aux données
- Models : ORM
- Schemas : validation Pydantic

---

# Sécurité

- JWT Authentication
- OAuth2 Password Flow
- RBAC
- Validation Pydantic
- Protection des routes
- Validation côté frontend
- Validation côté backend

---

# Documentation API

Swagger :

```
http://localhost:8001/docs
```

OpenAPI :

```
http://localhost:8001/openapi.json
```

---

# Installation

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

Backend disponible sur :

```
http://localhost:8001
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend disponible sur :

```
http://localhost:5173
```

---

# Tests

Backend

```bash
pytest
```

Frontend

```bash
npm test
```

Tests End-to-End

```bash
npx playwright test
```

---

# Qualité logicielle

Le projet applique les principes :

- SOLID
- DRY
- Separation of Concerns
- Repository Pattern
- Dependency Injection
- Layered Architecture
- RESTful API Design
- Type Safety
- Defensive Programming

---

# Roadmap IA

- Maintenance prédictive
- Moteur de recommandation
- RAG documentaire
- Classification intelligente
- Génération automatique de rapports
- Détection d'anomalies
- Agents IA collaboratifs
- LLM embarqué

---

# Auteur

**Mayssa Mejri**

