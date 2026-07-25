# SPRINTS.md

# Planification des Sprints

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document présente la planification du développement du projet SmartMaint IA.

Le projet est organisé en **quatre sprints**, chacun d'une durée d'une semaine.

Chaque sprint regroupe un ensemble cohérent de fonctionnalités à développer.

Le développement doit toujours respecter :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- DATABASE.md
- PRODUCT_BACKLOG.md
- DEVELOPMENT_RULES.md

---

# Sprint 1 : Initialisation et gestion des incidents

## Objectif

Mettre en place le socle technique de l'application et développer les premières fonctionnalités métier.

## Fonctionnalités

### Backend

- Initialisation du projet FastAPI
- Configuration de la base de données MySQL
- Authentification JWT
- Gestion des rôles
- Gestion des utilisateurs
- Gestion des bancs de test (BDD)
- Déclaration des incidents

### Frontend

- Initialisation du projet React
- Structure de l'application
- Authentification
- Interface Administrateur
- Interface Opérateur Production

## Livrables

- Projet initialisé
- Base de données opérationnelle
- Authentification fonctionnelle
- Gestion des utilisateurs
- Gestion des bancs BDD
- Déclaration d'un incident

## Critères de validation

- Les utilisateurs peuvent se connecter.
- Les rôles sont correctement appliqués.
- Les utilisateurs peuvent être gérés.
- Les bancs de test peuvent être gérés.
- Un incident peut être déclaré.

---

# Sprint 2 : Gestion des interventions

## Objectif

Développer les fonctionnalités liées aux tickets et aux interventions.

## Fonctionnalités

### Backend

- Gestion des tickets
- Gestion des interventions
- Gestion du planning
- Affectation des techniciens
- Gestion du calendrier préventif
- Historique des interventions

### Frontend

- Interface Manager Maintenance
- Interface Technicien
- Gestion des tickets
- Planning
- Gestion des interventions

## Livrables

- Gestion complète des tickets
- Planning fonctionnel
- Affectation des techniciens
- Gestion des interventions
- Historique des interventions

## Critères de validation

- Les tickets sont créés et consultables.
- Les interventions peuvent être planifiées.
- Les techniciens peuvent consulter leur planning.
- Les interventions peuvent être clôturées.

---

# Sprint 3 : Modules d'Intelligence Artificielle

## Objectif

Intégrer les fonctionnalités d'intelligence artificielle prévues dans le cahier des charges.

## Fonctionnalités

### Backend

- Agent Service Client
- Qualification automatique des incidents
- Création automatique des tickets
- Assistant d'Organisation
- Génération automatique des rapports

### Frontend

- Consultation des résultats générés par les modules IA
- Affichage des informations liées aux traitements IA

## Livrables

- Qualification automatique des incidents
- Création automatique des tickets
- Affectation intelligente
- Génération automatique des rapports

## Critères de validation

- Les incidents sont qualifiés automatiquement.
- Les tickets sont créés automatiquement après qualification.
- L'assistant d'organisation propose une affectation.
- Les rapports sont générés automatiquement.

---

# Sprint 4 : Finalisation

## Objectif

Finaliser l'application et préparer la version de démonstration.

## Fonctionnalités

### Backend

- Tableau de bord
- Maintenance prédictive
- Optimisations
- Corrections

### Frontend

- Tableau de bord
- Consultation des alertes prédictives
- Finalisation des interfaces

### Validation

- Tests fonctionnels
- Corrections des anomalies
- Vérification des API
- Vérification des interfaces

## Livrables

- Tableau de bord opérationnel
- Maintenance prédictive
- Application finalisée
- Documentation mise à jour

## Critères de validation

- Toutes les fonctionnalités du cahier des charges sont disponibles.
- Les tests sont validés.
- Les anomalies critiques sont corrigées.
- La documentation est complète.

---

# Règles de développement

Pour chaque sprint :

- Développer uniquement les fonctionnalités prévues.
- Respecter le Product Backlog.
- Respecter les diagrammes UML.
- Respecter les workflows.
- Respecter les règles métier.
- Mettre à jour la documentation si nécessaire.

---

# Fin d'un sprint

Un sprint est considéré comme terminé lorsque :

- Toutes les tâches du sprint sont terminées.
- Les fonctionnalités sont testées.
- Les critères de validation sont respectés.
- Aucun bug bloquant n'est présent.
- Le code est conforme aux règles de développement.

Le sprint suivant ne doit commencer qu'après validation du sprint précédent.