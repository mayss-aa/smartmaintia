# PERMISSIONS_MATRIX.md

# Matrice des Permissions

Projet : SmartMaint IA

Version : 1.0

---

# Objectif

Ce document définit de manière exhaustive les permissions de chaque rôle sur chaque module de SmartMaint IA.

Il constitue la référence officielle du système RBAC.

Toutes les autorisations du backend et du frontend doivent respecter strictement cette matrice.

Aucune permission ne doit être inventée.

---

# Documents de référence

Cette matrice complète :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- DATABASE.md
- RBAC.md
- API_SPECIFICATION.md
- DEVELOPMENT_RULES.md

---

# Légende

| Symbole | Signification |
|----------|---------------|
| ✅ | Autorisé |
| ❌ | Interdit |
| 👤 | Uniquement sur son propre profil |
| 🔒 | Réservé à l'Administrateur |

---

# Gestion des Utilisateurs

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter tous les utilisateurs | ✅ | ❌ | ❌ | ❌ |
| Consulter son profil | ✅ | 👤 | 👤 | 👤 |
| Créer un utilisateur | ✅ | ❌ | ❌ | ❌ |
| Modifier un utilisateur | ✅ | ❌ | ❌ | ❌ |
| Modifier son profil | ✅ | 👤 | 👤 | 👤 |
| Modifier un rôle | ✅ | ❌ | ❌ | ❌ |
| Supprimer un utilisateur | ✅ | ❌ | ❌ | ❌ |

---

# Gestion des Bancs de Test (BancTestBDD)

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | ✅ | ✅ |
| Créer | ✅ | ❌ | ❌ | ❌ |
| Modifier | ✅ | ❌ | ❌ | ❌ |
| Supprimer | ✅ | ❌ | ❌ | ❌ |

---

# Déclaration des Incidents

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Déclarer un incident | ❌ | ❌ | ❌ | ✅ |
| Consulter les incidents | ✅ | ✅ | ✅ (affectés) | 👤 |
| Modifier un incident | ❌ | ✅ | ❌ | ❌ |
| Clôturer un incident | ❌ | ✅ | ❌ | ❌ |

---

# Tickets de Maintenance

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | ✅ (affectés) | 👤 |
| Créer | ❌ | ✅ | ❌ | ❌ |
| Modifier | ❌ | ✅ | ❌ | ❌ |
| Affecter | ❌ | ✅ | ❌ | ❌ |
| Clôturer | ❌ | ✅ | ❌ | ❌ |

---

# Interventions

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | ✅ (affectées) | ❌ |
| Créer | ❌ | ✅ | ❌ | ❌ |
| Modifier | ❌ | ✅ | ❌ | ❌ |
| Affecter | ❌ | ✅ | ❌ | ❌ |
| Réaliser | ❌ | ❌ | ✅ | ❌ |
| Clôturer | ❌ | ❌ | ✅ | ❌ |

---

# Planning

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | 👤 | ❌ |
| Créer | ❌ | ✅ | ❌ | ❌ |
| Modifier | ❌ | ✅ | ❌ | ❌ |
| Supprimer | ❌ | ✅ | ❌ | ❌ |

---

# Rapports d'Intervention

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | 👤 | ❌ |
| Générer automatiquement | ❌ | ❌ | ✅ | ❌ |
| Modifier | ❌ | ❌ | ✅ | ❌ |
| Valider | ❌ | ✅ | ❌ | ❌ |

---

# Historique

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | 👤 | ❌ |

---

# Maintenance Prédictive

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter les alertes | ✅ | ✅ | ❌ | ❌ |
| Générer des alertes | IA | IA | IA | IA |
| Valider une alerte | ❌ | ✅ | ❌ | ❌ |

---

# Tableau de Bord

| Action | Administrateur | Manager | Technicien | Opérateur |
|---------|---------------|----------|------------|------------|
| Consulter | ✅ | ✅ | ❌ | ❌ |

---

# Modules IA

| Fonction | Administrateur | Manager | Technicien | Opérateur |
|-----------|---------------|----------|------------|------------|
| Qualification automatique | IA | IA | IA | IA |
| Affectation intelligente | IA | IA | IA | IA |
| Génération automatique des rapports | IA | IA | IA | IA |
| Maintenance prédictive | IA | IA | IA | IA |

Les modules IA sont déclenchés par les services métier.

Ils ne doivent jamais être appelés directement par un utilisateur.

---

# Authentification

Toutes les routes protégées doivent :

- vérifier le JWT ;
- vérifier le rôle ;
- vérifier les permissions définies dans cette matrice.

---

# Implémentation

Le backend doit centraliser toutes les permissions dans un seul module :

```
app/core/rbac.py
```

ou

```
app/dependencies/rbac.py
```

Les routes ne doivent jamais contenir directement des conditions du type :

```python
if user.role == ...
```

Toutes les autorisations doivent passer par les dépendances RBAC.

---

# Règles absolues

Ne jamais :

- inventer une permission ;
- donner davantage de droits qu'indiqué dans cette matrice ;
- contourner le contrôle RBAC.

Toute nouvelle permission doit être validée avant son implémentation.

---

# Références

Ce document est utilisé conjointement avec :

- PROJECT.md
- CAHIER_DES_CHARGES.md
- UML.md
- ERD.md
- DATABASE.md
- RBAC.md
- API_SPECIFICATION.md
- ARCHITECTURE.md
- DEVELOPMENT_RULES.md
- GEMINI.md
- KIRO.md