# PRODUCT_BACKLOG.md

# Product Backlog

Projet : SmartMaint IA

Version : 1.0

---

# Introduction

Ce document regroupe l'ensemble des fonctionnalités à développer.

Le backlog est organisé selon les sprints définis dans le projet.

Chaque tâche doit être développée indépendamment.

Le développement doit toujours respecter :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- DEVELOPMENT_RULES.md

---

# Sprint 1

## Objectif

Mettre en place le socle technique et développer les fonctionnalités fondamentales.

---

# Epic 1 : Initialisation du projet

### US-1.1 Création du Backend

**Tâches**

- TASK-1.1.1 Initialiser le projet FastAPI
- TASK-1.1.2 Configurer l'environnement Python
- TASK-1.1.3 Organiser la structure du projet
- TASK-1.1.4 Configurer Swagger

---

### US-1.2 Création du Frontend

**Tâches**

- TASK-1.2.1 Initialiser React
- TASK-1.2.2 Configurer les routes
- TASK-1.2.3 Créer le Layout principal
- TASK-1.2.4 Configurer Axios

---

### US-1.3 Base de données

**Tâches**

- TASK-1.3.1 Créer la base MySQL
- TASK-1.3.2 Configurer SQLAlchemy
- TASK-1.3.3 Configurer la connexion MySQL
- TASK-1.3.4 Vérifier la connexion

---

# Epic 2 : Authentification

### US-2.1 Authentification

**Tâches**

- TASK-2.1.1 Créer le modèle User
- TASK-2.1.2 Implémenter JWT
- TASK-2.1.3 Créer Login
- TASK-2.1.4 Créer Logout
- TASK-2.1.5 Protéger les routes

---

### US-2.2 Gestion des rôles

**Tâches**

- TASK-2.2.1 Créer les rôles
- TASK-2.2.2 Contrôler les permissions

---

# Epic 3 : Gestion des utilisateurs

### US-3.1 CRUD Utilisateurs

**Tâches**

- TASK-3.1.1 Ajouter un utilisateur
- TASK-3.1.2 Modifier un utilisateur
- TASK-3.1.3 Supprimer un utilisateur
- TASK-3.1.4 Consulter les utilisateurs

---

# Epic 4 : Gestion des bancs BDD

### US-4.1 CRUD Bancs BDD

**Tâches**

- TASK-4.1.1 Ajouter un banc
- TASK-4.1.2 Modifier un banc
- TASK-4.1.3 Supprimer un banc
- TASK-4.1.4 Consulter les bancs

---

# Epic 5 : Déclaration d'incident

### US-5.1 Création d'un incident

**Tâches**

- TASK-5.1.1 Créer le formulaire
- TASK-5.1.2 Enregistrer l'incident
- TASK-5.1.3 Valider les données

---

# Sprint 2

## Objectif

Développer la gestion des interventions.

---

# Epic 6 : Gestion des tickets

### US-6.1 Gestion des tickets

**Tâches**

- TASK-6.1.1 Consulter les tickets
- TASK-6.1.2 Modifier un ticket
- TASK-6.1.3 Changer le statut

---

# Epic 7 : Planification

### US-7.1 Planning

**Tâches**

- TASK-7.1.1 Créer le planning
- TASK-7.1.2 Affecter un technicien
- TASK-7.1.3 Modifier une affectation

---

# Epic 8 : Gestion des interventions

### US-8.1 Intervention

**Tâches**

- TASK-8.1.1 Consulter une intervention
- TASK-8.1.2 Démarrer une intervention
- TASK-8.1.3 Clôturer une intervention

---

# Epic 9 : Rapport

### US-9.1 Rapport d'intervention

**Tâches**

- TASK-9.1.1 Saisir un rapport
- TASK-9.1.2 Enregistrer le rapport

---

# Sprint 3

## Objectif

Développer les modules IA.

---

# Epic 10 : Agent Service Client

### US-10.1 Qualification IA

**Tâches**

- TASK-10.1.1 Recevoir une déclaration
- TASK-10.1.2 Qualifier l'incident
- TASK-10.1.3 Créer automatiquement un ticket

---

# Epic 11 : Assistant d'Organisation

### US-11.1 Affectation intelligente

**Tâches**

- TASK-11.1.1 Analyser les disponibilités
- TASK-11.1.2 Proposer un technicien

---

# Epic 12 : Génération automatique des rapports

### US-12.1 Génération IA

**Tâches**

- TASK-12.1.1 Générer un compte-rendu
- TASK-12.1.2 Enregistrer le rapport

---

# Sprint 4

## Objectif

Finaliser l'application.

---

# Epic 13 : Tableau de bord

### US-13.1 Dashboard

**Tâches**

- TASK-13.1.1 Afficher les indicateurs
- TASK-13.1.2 Afficher l'état des bancs
- TASK-13.1.3 Afficher les interventions

---

# Epic 14 : Maintenance prédictive

### US-14.1 Alertes

**Tâches**

- TASK-14.1.1 Consulter les alertes
- TASK-14.1.2 Proposer une intervention

---

# Epic 15 : Finalisation

### US-15.1 Validation

**Tâches**

- TASK-15.1.1 Corriger les anomalies
- TASK-15.1.2 Effectuer les tests fonctionnels
- TASK-15.1.3 Vérifier les API
- TASK-15.1.4 Vérifier le frontend
- TASK-15.1.5 Mettre à jour la documentation

---

# Définition de terminé (Definition of Done)

Une tâche est terminée lorsque :

- Le développement est terminé.
- Le code compile correctement.
- Les tests passent.
- Les règles de développement sont respectées.
- La documentation est mise à jour si nécessaire.
- La fonctionnalité est conforme au cahier des charges.