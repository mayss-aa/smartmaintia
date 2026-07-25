# DATABASE.md

# Documentation de la Base de Données

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document décrit la structure de la base de données du projet SmartMaint IA.

Il constitue la référence pour le développement des modèles SQLAlchemy, des schémas Pydantic et des API REST.

Toute modification de la base de données doit respecter :

- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- ARCHITECTURE.md

Le diagramme de classes validé par l'entreprise constitue la référence officielle de la structure des données.

---

# Système de Gestion de Base de Données

Le projet utilise :

- MySQL

Outil de conception :

- MySQL Workbench

Le développement du backend s'appuie sur :

- SQLAlchemy
- Pydantic
- Alembic

---

# Principes de conception

La base de données respecte les principes suivants :

- Normalisation des données
- Intégrité référentielle
- Clés primaires
- Clés étrangères
- Contraintes d'intégrité
- Relations définies dans le diagramme UML
- Respect du modèle relationnel (ERD)

Le projet utilise le **code métier du banc (`code_banc`)** comme identifiant fonctionnel conformément au diagramme de classes validé.

---

# Entités principales

Le système est composé des entités suivantes.

---

# Utilisateur

## Description

Représente les utilisateurs de l'application.

## Responsabilités

- Authentification
- Gestion des rôles
- Accès aux fonctionnalités selon les permissions

## Relations

- Un utilisateur possède un rôle.
- Un utilisateur peut déclarer plusieurs tickets de maintenance.
- Un utilisateur peut être technicien.
- Un utilisateur peut être Manager Maintenance.

---

# Énumération RoleUtilisateur

## Description

Le rôle n'est pas une entité persistante distincte.

Conformément à ERD.md, le rôle est modélisé sous la forme de l'énumération `RoleUtilisateur`, stockée dans la colonne `role` de la table `Utilisateur`.

## Valeurs

- ADMINISTRATEUR
- MANAGER_MAINTENANCE
- TECHNICIEN
- OPERATEUR_PRODUCTION

## Utilisation

- L'énumération détermine les autorisations d'accès (RBAC).
- Elle est directement portée par l'attribut `role` de l'utilisateur.
- Aucune table `Rôle` n'existe dans le modèle relationnel.

---

# BancTestBDD

## Description

Représente un banc de test industriel.

## Responsabilités

- Identification
- Localisation
- Gestion de son état
- Suivi des opérations de maintenance

## Relations

- Un banc peut posséder plusieurs tickets de maintenance.
- Un banc peut générer plusieurs alertes prédictives.
- Un banc peut posséder plusieurs historiques.

---

# TicketMaintenance

## Description

Représente un ticket de maintenance créé suite à une déclaration d'un problème sur un banc de test.

## Responsabilités

- Qualification de la demande
- Gestion du statut
- Suivi du cycle de vie
- Déclenchement d'une intervention

## Relations

- Est déclaré par un utilisateur.
- Est associé à un banc de test.
- Peut engendrer une intervention.

---

# Intervention

## Description

Représente une intervention de maintenance.

## Responsabilités

- Planification
- Affectation d'un technicien
- Réalisation de l'intervention
- Validation
- Clôture

## Relations

- Est associée à un ticket de maintenance ou à une alerte prédictive.
- Est réalisée par un technicien.
- Est validée par un Manager Maintenance.
- Est archivée dans l'historique global.

---

# Planning (vue dérivée)

## Description

Le planning ne constitue pas une entité persistante et n'est pas une table de la base de données.

Conformément à ERD.md, aucune table `Planning` n'existe dans le modèle relationnel.

Le planning est obtenu à partir des interventions planifiées, c'est-à-dire des enregistrements de la table `Intervention` disposant d'une `date_planifiee` et d'un technicien affecté (`id_technicien`).

## Construction

- Le planning est calculé dynamiquement à partir de la table `Intervention`.
- Il associe les techniciens aux interventions via l'attribut `id_technicien`.
- Il permet l'organisation des opérations préventives et curatives à partir de `date_planifiee` et de `type`.

---

# AlertePredictive

## Description

Représente une alerte générée automatiquement par le module de maintenance prédictive.

## Responsabilités

- Détection d'anomalies
- Estimation de la probabilité de panne
- Proposition d'intervention

## Relations

- Est associée à un banc de test.
- Peut déclencher une intervention.

---

# HistoriqueGlobal

## Description

Archive toutes les interventions réalisées.

Il conserve :

- les actions effectuées ;
- le rapport généré automatiquement par l'IA ;
- la date de clôture ;
- le MTTR calculé.

## Relations

- Est associé à une intervention.
- Est associé à un banc de test.

---

# Relations générales

Les relations entre les entités sont définies dans le diagramme de classes.

Relations principales :

- Le rôle d'un utilisateur est défini par l'énumération `RoleUtilisateur` (attribut `role`).
- Un utilisateur peut déclarer plusieurs tickets de maintenance.
- Un banc de test peut posséder plusieurs tickets de maintenance.
- Un banc de test peut générer plusieurs alertes prédictives.
- Un ticket de maintenance peut engendrer une intervention.
- Une alerte prédictive peut déclencher une intervention.
- Une intervention est réalisée par un technicien.
- Une intervention est validée par un Manager Maintenance.
- Une intervention terminée est archivée dans l'historique global.

---

# Contraintes

Toutes les entités doivent respecter :

- les clés primaires ;
- les clés étrangères ;
- les cardinalités du diagramme UML ;
- les règles métier définies dans le cahier des charges ;
- le modèle relationnel décrit dans ERD.md.

Les identifiants métier validés par l'entreprise doivent être conservés.

En particulier :

- `code_banc` ne doit jamais être remplacé par `id_banc`.

---

# Bonnes pratiques

Toujours :

- utiliser SQLAlchemy pour les modèles ;
- utiliser Pydantic pour les schémas ;
- utiliser Alembic pour les migrations ;
- respecter les relations UML ;
- respecter le modèle relationnel (ERD) ;
- conserver l'intégrité référentielle ;
- maintenir la cohérence entre la base de données, les API et le backend.

Ne jamais :

- modifier une relation métier sans validation ;
- supprimer une table ;
- supprimer une clé étrangère ;
- modifier une cardinalité ;
- renommer une entité validée ;
- remplacer `code_banc` par un identifiant numérique.

---

# Synchronisation

Toute évolution du modèle de données implique la mise à jour des documents suivants :

- UML.md
- ERD.md
- API_SPECIFICATION.md
- ARCHITECTURE.md
- CAHIER_DES_CHARGES.md (si nécessaire)

La documentation doit toujours rester synchronisée avec le code.

---

# Références

Ce document est utilisé conjointement avec :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- ARCHITECTURE.md
- API_SPECIFICATION.md
- PRODUCT_BACKLOG.md
- SPRINTS.md
- DEVELOPMENT_RULES.md
- GEMINI.md