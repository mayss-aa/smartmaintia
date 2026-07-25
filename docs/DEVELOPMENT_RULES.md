# DEVELOPMENT_RULES.md

# Règles de développement

Ce document définit les règles de développement à respecter durant tout le projet SmartMaint IA.

Il complète les documents suivants :
- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ARCHITECTURE.md
- DATABASE.md
- ERD.md
- API_SPECIFICATION.md
- PRODUCT_BACKLOG.md
- SPRINTS.md
- GEMINI.md

Ces documents constituent la source de vérité du projet.
---

# Respect du modèle de données

Le modèle relationnel validé par l'entreprise constitue la référence officielle.

Les noms des entités, des attributs et des relations doivent être conservés tels qu'ils apparaissent dans le diagramme de classes.

Ne jamais :

- renommer une table ;
- renommer un attribut ;
- remplacer `code_banc` par `id_banc` ;
- modifier les cardinalités ;
- modifier les énumérations ;

sans validation préalable de l'encadrant.

---

# Principe général

Avant chaque développement :

1. Lire PROJECT.md
2. Lire CAHIER_DES_CHARGES.md
3. Lire UML.md
4. Lire DATABASE.md
5. Lire PRODUCT_BACKLOG.md
6. Lire SPRINTS.md

Ne jamais développer une fonctionnalité absente du cahier des charges.

Ne jamais modifier un workflow sans validation.

Ne jamais modifier le diagramme UML sans validation.

Ne jamais inventer une règle métier.

Respecter strictement les documents de conception.

---

# Stack officielle

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic

---

## Frontend

- React

---

## Base de données

- MySQL

---

## Outil de conception

- MySQL Workbench

---

# Intelligence Artificielle

Les modules IA sont intégrés au backend Python.

Ils sont composés de :

- Agent Service Client
- Assistant d'Organisation
- Agent de Génération des Rapports
- Module de Maintenance Prédictive

Ne jamais créer de nouveaux agents IA.

Ne jamais modifier leur rôle sans validation.

---

# Architecture

Toujours respecter l'architecture logique validée.

Architecture générale :

Frontend React

↓

Backend Python

↓

Modules IA

↓

Base de données MySQL

Ne jamais modifier cette architecture sans validation.

---

# Organisation du Backend

Le backend doit rester organisé par responsabilités.

Les principaux modules sont :

- Authentification
- Gestion des utilisateurs
- Gestion des bancs BDD
- Gestion des tickets
- Gestion des interventions
- Gestion des plannings
- Gestion des historiques
- Tableau de bord
- Modules IA

Chaque module doit rester indépendant et clairement organisé.

---

# Organisation du Frontend

Le frontend doit être organisé en composants réutilisables.

Les interfaces sont :

- Administrateur
- Manager Maintenance
- Technicien
- Opérateur Production

Chaque interface ne doit afficher que les fonctionnalités autorisées.

---

# Base de données

Avant toute modification :

- analyser le diagramme de classes
- respecter les relations
- respecter les cardinalités
- respecter les clés primaires
- respecter les clés étrangères

Ne jamais supprimer une table sans validation.

Ne jamais modifier une relation métier sans validation.

---

# API REST

Toutes les API doivent :

- respecter les principes REST
- utiliser FastAPI
- retourner du JSON
- utiliser les codes HTTP appropriés
- être documentées avec Swagger/OpenAPI

Toutes les routes doivent être cohérentes avec le cahier des charges.

---

# Validation

Toutes les données entrantes doivent être validées avec Pydantic.

Aucune donnée ne doit être enregistrée sans validation.

---

# Authentification

Le système utilise une authentification basée sur JWT.

Les rôles sont :

- Administrateur
- Manager Maintenance
- Technicien
- Opérateur Production

Toutes les routes protégées doivent vérifier les autorisations.

---

# Sécurité

Toujours vérifier :

- Validation des entrées
- JWT
- RBAC
- Protection contre SQL Injection
- Protection contre XSS

Ne jamais stocker un mot de passe en clair.

Toujours utiliser le hachage des mots de passe.

---

# Développement des modules IA

Avant toute modification :

- vérifier le cahier des charges
- vérifier le workflow
- vérifier les règles métier

Les agents IA ne doivent jamais modifier directement les données sans passer par la logique métier du backend.

---

# Tests

Avant chaque validation :

- vérifier le démarrage du backend
- vérifier le démarrage du frontend
- vérifier Swagger
- vérifier les endpoints
- vérifier la connexion MySQL
- vérifier les fonctionnalités développées

---

# Documentation

Toute nouvelle fonctionnalité doit être documentée.

Les documents doivent rester synchronisés avec le code.

Mettre à jour :

- PROJECT.md
- API_SPECIFICATION.md
- DATABASE.md
- PRODUCT_BACKLOG.md

si une évolution le nécessite.

---

# Workflow obligatoire

Avant de coder :

1. Reformuler le besoin.
2. Identifier les fichiers concernés.
3. Vérifier le cahier des charges.
4. Vérifier UML.md.
5. Vérifier DATABASE.md.
6. Vérifier PRODUCT_BACKLOG.md.
7. Identifier les impacts.
8. Proposer un plan de développement.
9. Attendre la validation avant toute modification.

---

# Après chaque développement

Toujours vérifier :

- Bugs
- Régressions
- Erreurs de compilation
- Failles de sécurité
- Duplication de code
- Imports inutiles
- Code mort

Corriger automatiquement les anomalies détectées.

---

# Définition de terminé (Definition of Done)

Une tâche est terminée uniquement si :

- Le développement est terminé.
- Les tests sont validés.
- Swagger est mis à jour.
- Aucun bug bloquant n'est détecté.
- La documentation est mise à jour.
- Le Product Backlog est mis à jour si nécessaire.

---

# Règles absolues

Ne jamais :

- inventer une fonctionnalité
- modifier le cahier des charges
- modifier les workflows
- modifier les diagrammes UML
- changer l'architecture logique
- utiliser une technologie non prévue
- supprimer du code métier sans justification
- continuer lorsqu'une information est manquante

Toujours privilégier :

- la simplicité
- la lisibilité
- la maintenabilité
- la cohérence
- la sécurité
- le respect du cahier des charges
- le respect des workflows validés