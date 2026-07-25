# ERD.md

# Entity Relationship Diagram (ERD)

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document décrit le modèle relationnel de la base de données du projet **SmartMaint IA**.

Il constitue la référence officielle pour :

- la conception de la base de données MySQL ;
- l'implémentation des modèles SQLAlchemy ;
- les schémas Pydantic ;
- les migrations de la base de données ;
- les relations entre les entités métier.

Le contenu de ce document est directement issu du **diagramme de classes validé par l'entreprise** et doit rester synchronisé avec celui-ci.

---

# Système de Gestion de Base de Données

Le projet utilise :

- **MySQL 8.x**

Outil de conception :

- **MySQL Workbench**

Toutes les implémentations doivent respecter la structure décrite dans ce document.

---

# Convention de modélisation

Le modèle relationnel est basé sur le diagramme UML validé.

Les noms des tables, attributs et relations doivent être conservés.

Le projet utilise volontairement **code_banc** comme identifiant métier.

Cette convention est imposée par la conception validée par l'entreprise.

Ne jamais remplacer :

```text
code_banc
```

par

```text
id_banc
```

sans validation préalable de l'encadrant.

Toutes les implémentations (MySQL, SQLAlchemy, FastAPI et React) doivent respecter cette convention.

---

# Types SQL utilisés

| UML | MySQL |
|------|--------|
| int | INT |
| string | VARCHAR |
| float | FLOAT |
| text | TEXT |
| datetime | DATETIME |
| boolean | BOOLEAN |
| Enum | ENUM |

---

# Énumérations

## RoleUtilisateur

- ADMINISTRATEUR
- MANAGER_MAINTENANCE
- TECHNICIEN
- OPERATEUR_PRODUCTION

---

## StatutBanc

- OPERATIONNEL
- EN_PANNE
- EN_MAINTENANCE

---

## StatutTicket

- OUVERT
- EN_COURS
- CLOTURE

---

## TypeIntervention

- CURATIF
- PREVENTIF
- PREDICTIF

---

# Modèle relationnel

---

# Table : Utilisateur

## Description

Contient l'ensemble des utilisateurs de la plateforme.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| id_user | INT | ✅ | | ❌ | Identifiant utilisateur |
| nom | VARCHAR(100) | | | ❌ | Nom |
| prenom | VARCHAR(100) | | | ❌ | Prénom |
| email | VARCHAR(150) | | | ❌ | Adresse e-mail |
| mot_de_passe_hash | VARCHAR(255) | | | ❌ | Mot de passe chiffré |
| role | ENUM(RoleUtilisateur) | | | ❌ | Rôle utilisateur |

## Relations

- Un utilisateur déclare plusieurs tickets.
- Un utilisateur peut être technicien.
- Un utilisateur peut être manager maintenance.
- Un utilisateur supervise plusieurs interventions.

---

# Table : BancTestBDD

## Description

Représente un banc de test industriel.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| code_banc | VARCHAR(50) | ✅ | | ❌ | Code unique du banc |
| nom | VARCHAR(100) | | | ❌ | Nom du banc |
| emplacement | VARCHAR(150) | | | ❌ | Emplacement |
| statut | ENUM(StatutBanc) | | | ❌ | État actuel |

## Relations

- Un banc possède plusieurs tickets.
- Un banc génère plusieurs alertes prédictives.
- Un banc possède plusieurs historiques.

---

# Table : TicketMaintenance

## Description

Contient les incidents déclarés.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| id_ticket | INT | ✅ | | ❌ | Identifiant du ticket |
| code_banc | VARCHAR(50) | | ✅ | ❌ | Référence du banc |
| symptome | VARCHAR(255) | | | ❌ | Symptôme observé |
| criticite | VARCHAR(50) | | | ❌ | Niveau de criticité |
| date_creation | DATETIME | | | ❌ | Date de création |
| statut | ENUM(StatutTicket) | | | ❌ | Statut du ticket |

## Clés étrangères

- code_banc → BancTestBDD.code_banc

## Relations

- Un utilisateur déclare plusieurs tickets.
- Un ticket appartient à un banc.
- Un ticket peut engendrer une intervention.

---

# Table : Intervention

## Description

Contient les interventions de maintenance.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| id_intervention | INT | ✅ | | ❌ | Identifiant |
| id_technicien | INT | | ✅ | ❌ | Technicien affecté |
| id_manager | INT | | ✅ | ❌ | Manager responsable |
| id_ticket | INT | | ✅ | ✅ | Ticket d'origine |
| id_alerte | INT | | ✅ | ✅ | Alerte prédictive |
| type | ENUM(TypeIntervention) | | | ❌ | Type d'intervention |
| date_planifiee | DATETIME | | | ❌ | Date prévue |
| duree_reparation | INT | | | ❌ | Durée |
| statut_intervention | VARCHAR(50) | | | ❌ | Statut |

## Clés étrangères

- id_technicien → Utilisateur.id_user
- id_manager → Utilisateur.id_user
- id_ticket → TicketMaintenance.id_ticket
- id_alerte → AlertePredictive.id_alerte

## Relations

- Une intervention peut provenir d'un ticket.
- Une intervention peut provenir d'une alerte.
- Une intervention est réalisée par un technicien.
- Une intervention est validée par un manager.
- Une intervention est archivée dans l'historique.

---

# Table : AlertePredictive

## Description

Contient les alertes générées automatiquement par le module prédictif.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| id_alerte | INT | ✅ | | ❌ | Identifiant |
| code_banc | VARCHAR(50) | | ✅ | ❌ | Banc concerné |
| composant_cible | VARCHAR(150) | | | ❌ | Composant surveillé |
| probabilite_panne | FLOAT | | | ❌ | Probabilité estimée |
| date_detection | DATETIME | | | ❌ | Date de détection |
| statut_alerte | VARCHAR(50) | | | ❌ | Statut |

## Clés étrangères

- code_banc → BancTestBDD.code_banc

## Relations

- Une alerte appartient à un banc.
- Une alerte peut déclencher une intervention.

---

# Table : HistoriqueGlobal

## Description

Archive l'ensemble des interventions réalisées.

## Colonnes

| Colonne | Type | PK | FK | Null | Description |
|----------|------|----|----|------|-------------|
| id_historique | INT | ✅ | | ❌ | Identifiant |
| code_banc | VARCHAR(50) | | ✅ | ❌ | Banc concerné |
| id_intervention | INT | | ✅ | ❌ | Intervention |
| type_action | VARCHAR(100) | | | ❌ | Type d'action |
| rapport_clean_ia | TEXT | | | ❌ | Rapport généré par l'IA |
| date_cloture | DATETIME | | | ❌ | Date de clôture |
| mttr_calcule | INT | | | ❌ | MTTR calculé |

## Clés étrangères

- code_banc → BancTestBDD.code_banc
- id_intervention → Intervention.id_intervention

## Relations

- Un historique appartient à un banc.
- Un historique est associé à une intervention.

---

# Cardinalités

| Relation | Cardinalité |
|----------|-------------|
| Utilisateur → TicketMaintenance | 1 → N |
| Utilisateur → Intervention | 1 → N |
| BancTestBDD → TicketMaintenance | 1 → N |
| BancTestBDD → AlertePredictive | 1 → N |
| BancTestBDD → HistoriqueGlobal | 1 → N |
| TicketMaintenance → Intervention | 0..1 → 1 |
| AlertePredictive → Intervention | 0..1 → 1 |
| Intervention → HistoriqueGlobal | 1 → 1 |

---

# Contraintes d'intégrité

Le modèle relationnel doit respecter :

- les clés primaires ;
- les clés étrangères ;
- les cardinalités ;
- les énumérations ;
- les règles métier définies dans le cahier des charges.

Toutes les valeurs obligatoires sont définies en **NOT NULL**.

Les clés primaires sont uniques.

Les clés étrangères doivent toujours référencer une valeur existante.

---

# Index recommandés

Afin d'améliorer les performances, les index suivants sont recommandés :

- code_banc
- email
- statut
- date_creation
- date_detection
- date_planifiee
- id_ticket
- id_intervention

---

# Implémentation SQLAlchemy

Toutes les tables doivent être représentées par un modèle SQLAlchemy.

Les relations doivent utiliser :

- ForeignKey
- relationship

Les modèles doivent rester synchronisés avec le diagramme UML et ce document.

---

# Règles de développement

Toujours :

- respecter le diagramme de classes ;
- respecter les cardinalités ;
- respecter les énumérations ;
- respecter les clés étrangères ;
- utiliser les types MySQL définis dans ce document ;
- conserver l'intégrité référentielle.

Ne jamais :

- modifier une table ;
- modifier une relation ;
- modifier une cardinalité ;
- remplacer `code_banc` par `id_banc` ;
- modifier une énumération ;

sans validation préalable de l'encadrant.

---

# Synchronisation

Toute évolution du modèle relationnel implique la mise à jour des documents suivants :

- UML.md
- DATABASE.md
- ARCHITECTURE.md
- API_SPECIFICATION.md

La documentation doit toujours rester synchronisée avec le code.

---

# Références

Ce document est utilisé conjointement avec :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- DATABASE.md
- ARCHITECTURE.md
- API_SPECIFICATION.md
- PRODUCT_BACKLOG.md
- SPRINTS.md
- DEVELOPMENT_RULES.md
- GEMINI.md