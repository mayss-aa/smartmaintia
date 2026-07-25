# API_SPECIFICATION.md

# Documentation des API REST

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document décrit les API REST du projet SmartMaint IA.

Il constitue la référence pour le développement du backend FastAPI et du frontend React.

Toutes les API doivent respecter :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ARCHITECTURE.md
- DATABASE.md
- ERD.md
- PRODUCT_BACKLOG.md
- SPRINTS.md
- DEVELOPMENT_RULES.md
- GEMINI.md

---

# Architecture API

Préfixe commun :

```text
/api/v1/
```

- Réponses JSON.
- Authentification JWT.
- Documentation Swagger/OpenAPI.

## Authentification

| Méthode | Route |
|---|---|
| POST | /auth/login |
| GET | /auth/me |
| POST | /auth/logout |

## Utilisateurs

| Méthode | Route |
|---|---|
| GET | /users |
| GET | /users/{id_user} |
| POST | /users |
| PUT | /users/{id_user} |
| DELETE | /users/{id_user} |

## Rôles

Le rôle n'est pas une entité persistante. Conformément à ERD.md, il correspond à l'énumération `RoleUtilisateur` portée par l'attribut `role` de l'utilisateur. La route ci-dessous retourne les valeurs de cette énumération.

| Méthode | Route |
|---|---|
| GET | /roles |

## Bancs de test

Le projet utilise `code_banc` comme identifiant métier.

| Méthode | Route |
|---|---|
| GET | /bancs |
| GET | /bancs/{code_banc} |
| POST | /bancs |
| PUT | /bancs/{code_banc} |
| DELETE | /bancs/{code_banc} |

## Tickets de maintenance

| Méthode | Route |
|---|---|
| GET | /tickets |
| GET | /tickets/{id_ticket} |
| POST | /tickets |
| PUT | /tickets/{id_ticket} |
| DELETE | /tickets/{id_ticket} |

## Interventions

| Méthode | Route |
|---|---|
| GET | /interventions |
| GET | /interventions/{id_intervention} |
| POST | /interventions |
| PUT | /interventions/{id_intervention} |
| DELETE | /interventions/{id_intervention} |

## Planning

Le planning n'est pas une table de la base de données. Conformément à ERD.md, aucune entité `Planning` n'existe. CLe planning n'est pas une table de la base de données.

Conformément à ERD.md, aucune entité `Planning` n'existe.

Les routes du module Planning manipulent uniquement les enregistrements de la table `Intervention` correspondant à des interventions planifiées.

Aucun modèle SQLAlchemy `Planning` et aucune migration Alembic ne doivent être créés.
| Méthode | Route |
|---|---|
| GET | /planning |
| POST | /planning |
| PUT | /planning/{id} |

## Alertes prédictives

| Méthode | Route |
|---|---|
| GET | /alertes |
| GET | /alertes/{id_alerte} |

## Historique global

| Méthode | Route |
|---|---|
| GET | /historiques |
| GET | /historiques/{id_historique} |

Le rapport d'intervention est intégré à l'historique (`rapport_clean_ia`).

## Tableau de bord

Le tableau de bord n'est pas une entité persistante.

Conformément à ERD.md, aucune table `Dashboard` n'existe dans la base de données et aucun modèle SQLAlchemy `Dashboard` ne doit être créé.

Le tableau de bord agrège uniquement les données provenant des entités existantes :

- Utilisateur
- BancTestBDD
- TicketMaintenance
- Intervention
- AlertePredictive
- HistoriqueGlobal

Aucune donnée ne doit être persistée.

Le backend ne doit pas créer de logique métier supplémentaire.

Les informations retournées doivent uniquement être dérivées des données existantes conformément aux documents du projet.

| Méthode | Route |
|---|---|
| GET | /dashboard |

### Contraintes

- Ne créer aucune table `Dashboard`.
- Ne créer aucun modèle SQLAlchemy `Dashboard`.
- Ne créer aucune migration Alembic.
- Ne créer aucun traitement planifié.
- Ne créer aucun indicateur ou KPI non documenté.
- Respecter strictement les règles définies dans `RBAC.md` et `PERMISSIONS_MATRIX.md`.
## Modules IA

Les modules IA ne font pas partie du périmètre de développement actuel.

Les routes ci-dessous sont réservées à une future intégration.

À cette étape du projet :

- aucune logique d'intelligence artificielle ne doit être implémentée ;
- aucun moteur de prédiction ne doit être développé ;
- aucun modèle LLM ne doit être intégré ;
- aucun système RAG ne doit être développé ;
- aucun agent IA ne doit être implémenté ;
- aucune communication avec un service IA externe ne doit être réalisée.

Le backend peut uniquement préparer la structure technique nécessaire à une future intégration.

| Méthode | Route |
|---|---|
| POST | /ai/qualify-ticket |
| POST | /ai/assign-technician |
| POST | /ai/generate-report |
| GET | /ai/predictive-alerts |

# Codes HTTP

200, 201, 204, 400, 401, 403, 404, 409, 422, 500.

# Références

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ARCHITECTURE.md
- DATABASE.md
- ERD.md
- PRODUCT_BACKLOG.md
- SPRINTS.md
- DEVELOPMENT_RULES.md
- GEMINI.md
