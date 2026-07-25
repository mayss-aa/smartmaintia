# PROJECT.md

# SmartMaint IA

## Pilotage automatisé des activités de maintenance industrielle des bancs de test (BDD) via des agents et assistants IA.

Version : 1.0

---

# Présentation

SmartMaint IA est une application Web permettant de gérer les activités de maintenance industrielle des bancs de test (BDD).

L'objectif est d'assister les équipes de maintenance grâce à plusieurs modules d'intelligence artificielle afin d'améliorer la gestion des interventions curatives, préventives et prédictives.

L'application couvre l'ensemble du cycle de vie d'une intervention :

- Déclaration d'un incident
- Qualification de l'incident
- Création automatique d'un ticket
- Planification
- Affectation d'un technicien
- Réalisation de l'intervention
- Génération automatique du rapport
- Clôture de l'intervention
- Historisation des opérations

---

# Objectifs

Le projet vise à :

- Réduire le MTTR (Temps Moyen de Réparation).
- Automatiser la qualification des incidents.
- Optimiser la planification des interventions.
- Assister les techniciens lors des opérations de maintenance.
- Générer automatiquement les comptes-rendus.
- Garantir la traçabilité des interventions.
- Faciliter la maintenance préventive.
- Assister la maintenance prédictive.

---

# Acteurs

Le système comporte quatre acteurs principaux :

- Administrateur
- Manager Maintenance
- Technicien
- Opérateur Production

Chaque acteur dispose de fonctionnalités spécifiques décrites dans le cahier des charges.

---

# Modules Fonctionnels

Le projet est composé des modules suivants.

## Module 1

Réception et Qualification IA

Responsabilités :

- Réception des incidents
- Analyse des informations
- Qualification automatique
- Création automatique des tickets

---

## Module 2

Planification et Assignation

Responsabilités :

- Gestion des plannings
- Affectation des techniciens
- Organisation des interventions
- Gestion du calendrier préventif

---

## Module 3

Suivi des Interventions

Responsabilités :

- Gestion des interventions
- Saisie des rapports
- Génération automatique des comptes-rendus
- Historisation

---

## Module 4

Maintenance Prédictive

Responsabilités :

- Analyse des historiques
- Détection des anomalies
- Génération d'alertes
- Assistance à la décision

---

# Architecture

Architecture Client / Serveur

Frontend

- React

Backend

- Python
- FastAPI
- API REST

Base de données

- MySQL

Les modules d'intelligence artificielle sont intégrés au backend.

---

# Technologies

## Frontend

- React
- Vite
- React Router
- Axios

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

## Base de données

- MySQL

## Outil de conception

- MySQL Workbench

---

# Organisation du projet

Le projet est organisé en deux applications.

```text
SmartMaintIA/

backend/

frontend/

docs/
```

Le backend contient la logique métier, les API REST et les modules d'intelligence artificielle.

Le frontend contient les interfaces utilisateurs.

Le dossier docs regroupe toute la documentation du projet.

---

# Documentation

Le développement doit toujours respecter les documents suivants :

- CAHIER_DES_CHARGES.md
- UML.md
- DATABASE.md
- API_SPECIFICATION.md
- DEVELOPMENT_RULES.md
- PRODUCT_BACKLOG.md
- SPRINTS.md

Ces documents constituent la référence du projet.

---

# Workflow général

Le fonctionnement général est le suivant :

1. L'opérateur de production déclare un incident.
2. Le système analyse les informations.
3. L'Agent Service Client qualifie l'incident.
4. Un ticket est créé automatiquement.
5. Le Manager Maintenance consulte le ticket.
6. L'Assistant d'Organisation propose une affectation.
7. Le Manager valide l'affectation.
8. Le technicien réalise l'intervention.
9. Le technicien saisit un rapport.
10. L'Agent de Génération des Rapports produit le compte-rendu.
11. L'intervention est clôturée.
12. L'historique est mis à jour.

---

# Principes de développement

Le développement doit respecter les principes suivants :

- Respecter strictement le cahier des charges.
- Respecter les diagrammes UML.
- Respecter les workflows.
- Respecter les rôles des utilisateurs.
- Ne pas ajouter de nouvelles fonctionnalités.
- Ne pas supprimer de fonctionnalités existantes.
- Produire un code clair, structuré et maintenable.
- Séparer le frontend et le backend.
- Développer les fonctionnalités selon les sprints définis.

---

# Planning

Le développement est organisé en quatre sprints :

- Sprint 1 : Initialisation et gestion des incidents
- Sprint 2 : Gestion des interventions
- Sprint 3 : Intégration des modules IA
- Sprint 4 : Finalisation, maintenance prédictive, tableau de bord et tests

---

# Référence

Ce document présente la vision générale du projet.

Les spécifications détaillées sont décrites dans le fichier **CAHIER_DES_CHARGES.md**, qui constitue la référence fonctionnelle principale.