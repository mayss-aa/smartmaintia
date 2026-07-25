# RBAC.md

# Gestion des rôles et des permissions (RBAC)

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document définit les règles de contrôle d'accès (Role-Based Access Control - RBAC) de SmartMaint IA.

Il constitue la référence officielle pour :

- l'autorisation des API ;
- les permissions des utilisateurs ;
- les contrôles d'accès du frontend ;
- les services métier.

Toute implémentation RBAC doit respecter strictement ce document.

---

# Documents de référence

Le RBAC est défini conjointement avec :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- DATABASE.md
- API_SPECIFICATION.md
- DEVELOPMENT_RULES.md

---

# Principe général

L'authentification repose sur JWT.

Chaque utilisateur possède un rôle unique.

Les permissions sont accordées exclusivement en fonction du rôle.

Aucune autorisation ne doit être codée "en dur" dans les routes.

Le contrôle d'accès doit être centralisé.

---

# Rôles

Le système possède uniquement les rôles suivants.

## Administrateur

Responsable de l'administration complète de la plateforme.

## Manager Maintenance

Responsable du pilotage de la maintenance.

## Technicien

Responsable de l'exécution des interventions.

## Opérateur Production

Responsable de la déclaration des incidents.

---

# Permissions générales

## Administrateur

Peut :

- gérer les utilisateurs ;
- gérer les profils ;
- gérer les bancs de test ;
- consulter tous les utilisateurs ;
- créer un utilisateur ;
- modifier un utilisateur ;
- supprimer un utilisateur ;
- consulter tous les bancs ;
- créer un banc ;
- modifier un banc ;
- supprimer un banc.

Ne réalise pas les interventions.

---

## Manager Maintenance

Peut :

- consulter son profil ;
- modifier son propre profil ;
- consulter les tickets ;
- valider les interventions ;
- assigner les interventions ;
- gérer le planning préventif ;
- consulter le tableau de bord ;
- consulter les alertes prédictives ;
- consulter les historiques.

Ne peut pas :

- créer un utilisateur ;
- supprimer un utilisateur ;
- gérer les bancs ;
- modifier les rôles.

---

## Technicien

Peut :

- consulter son profil ;
- modifier son propre profil ;
- consulter son planning ;
- consulter les interventions qui lui sont affectées ;
- réaliser une intervention ;
- saisir un rapport d'intervention ;
- consulter son historique.

Ne peut pas :

- gérer les utilisateurs ;
- gérer les bancs ;
- consulter le dashboard global ;
- affecter des interventions.

---

## Opérateur Production

Peut :

- consulter son profil ;
- modifier son propre profil ;
- déclarer un incident ;
- consulter ses propres déclarations.

Ne peut pas :

- gérer les utilisateurs ;
- gérer les bancs ;
- consulter les interventions ;
- consulter le dashboard ;
- modifier les plannings.

---

# Gestion des utilisateurs

## Consultation

### Administrateur

Peut consulter tous les utilisateurs.

### Autres rôles

Peuvent consulter uniquement leur propre profil.

---

## Création

Uniquement :

Administrateur

---

## Modification

Administrateur :

- peut modifier tous les utilisateurs.

Autres utilisateurs :

- peuvent uniquement modifier leur propre profil.

Ils ne peuvent jamais modifier :

- leur rôle ;
- leur identifiant.

---

## Suppression

Uniquement :

Administrateur

---

# Gestion des BancTestBDD

Administrateur :

- consultation ;
- création ;
- modification ;
- suppression.

Tous les autres rôles :

consultation uniquement si le cahier des charges le prévoit.

---

# Gestion des Tickets

Opérateur Production :

- déclaration.

Manager Maintenance :

- consultation ;
- validation ;
- affectation.

Technicien :

- consultation des tickets qui lui sont affectés.

Administrateur :

- consultation.

---

# Gestion des Interventions

Manager Maintenance :

- création ;
- affectation ;
- validation.

Technicien :

- exécution ;
- clôture ;
- rapport.

Administrateur :

- consultation.

---

# Tableau de bord

Consultation autorisée uniquement pour :

- Administrateur
- Manager Maintenance

---

# Alertes prédictives

Consultation :

- Administrateur
- Manager Maintenance

---

# Historiques

Administrateur :

- consultation complète.

Manager Maintenance :

- consultation complète.

Technicien :

- consultation de son historique.

---

# Auto-modification

Tous les utilisateurs authentifiés peuvent modifier uniquement :

- nom ;
- prénom ;
- email ;
- mot de passe.

Ils ne peuvent jamais modifier :

- leur rôle ;
- leur identifiant ;
- leurs permissions.

---

# Authentification

Toutes les routes protégées doivent :

- vérifier le JWT ;
- vérifier le rôle ;
- vérifier les permissions.

---

# Implémentation

Le contrôle d'accès doit être centralisé.

Ne jamais écrire :

```python
if user.role == ...
```

dans plusieurs fichiers.

Créer un module dédié :

```
app/core/rbac.py
```

ou

```
app/dependencies/rbac.py
```

contenant toutes les règles.

Les routes utilisent uniquement des dépendances RBAC.

---

# Bonnes pratiques

Toujours :

- centraliser les permissions ;
- réutiliser les dépendances RBAC ;
- respecter le principe du moindre privilège.

Ne jamais :

- donner plus de droits que prévu ;
- inventer une permission ;
- contourner le contrôle d'accès.

---

# Références

Ce document est utilisé conjointement avec :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- DATABASE.md
- API_SPECIFICATION.md
- ARCHITECTURE.md
- DEVELOPMENT_RULES.md
- GEMINI.md
- KIRO.md