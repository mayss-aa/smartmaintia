# AUTHENTICATION.md

# SmartMaint IA

## Frontend Authentication

Version : 1.0

---

# Objectif

Ce document décrit le fonctionnement complet de l'authentification du frontend.

Le frontend utilise une authentification JWT fournie par le backend FastAPI.

Toutes les pages protégées nécessitent un utilisateur authentifié.

---

# Architecture

```
Utilisateur

        │

        ▼

Login Page

        │

POST /auth/login

        │

        ▼

Backend FastAPI

        │

JWT Access Token

        │

        ▼

Frontend

        │

Stockage sécurisé

        │

        ▼

Protected Routes

```

---

# Endpoints utilisés

## Authentification

```
POST

/api/v1/auth/login
```

Retourne :

```json
{
    "access_token": "...",
    "token_type": "bearer"
}
```

---

## Utilisateur connecté

```
GET

/api/v1/auth/me
```

Retourne :

```json
{
    "id_user": 1,
    "nom": "Admin",
    "prenom": "System",
    "email": "admin@example.com",
    "role": "ADMINISTRATEUR"
}
```

---

## Déconnexion

```
POST

/api/v1/auth/logout
```

Même si le backend invalide le token, le frontend doit toujours supprimer les informations locales.

---

# Flux de connexion

1.

L'utilisateur ouvre

```
/login
```

2.

Il saisit :

- email
- mot de passe

3.

Le frontend appelle :

```
POST /auth/login
```

4.

Le backend retourne :

```
access_token
```

5.

Le frontend :

- sauvegarde le JWT
- récupère le profil utilisateur avec

```
GET /auth/me
```

6.

Le rôle détermine l'interface affichée.

---

# Flux de déconnexion

Lors du logout :

- suppression du JWT
- suppression du profil utilisateur
- nettoyage du cache React Query
- redirection vers Login

---

# Stockage

Le frontend peut utiliser :

```
localStorage
```

ou

```
sessionStorage
```

selon les besoins du projet.

Les informations conservées :

```
access_token

currentUser
```

Aucun mot de passe ne doit être stocké.

---

# Axios

Toutes les requêtes utilisent automatiquement :

```
Authorization

Bearer <token>
```

grâce à un interceptor Axios.

Les composants React ne doivent jamais ajouter ce header eux-mêmes.

---

# Protected Routes

Toutes les routes sont protégées.

Exemple :

```
Dashboard

Users

Tickets

Interventions

Planning

Historique

Alertes
```

Si aucun JWT n'existe :

```
→ Redirection Login
```

---

# Route Guard

Le projet utilise un composant :

```
ProtectedRoute
```

Responsabilités :

- vérifier le JWT
- vérifier le rôle
- rediriger si nécessaire

---

# Gestion RBAC

Après récupération de :

```
GET /auth/me
```

le frontend adapte automatiquement l'interface.

Exemple :

ADMINISTRATEUR

```
Dashboard

Users

Bancs
```

---

MANAGER_MAINTENANCE

```
Dashboard

Tickets

Planning

Alertes

Historique
```

---

TECHNICIEN

```
Planning

Mes interventions

Historique
```

---

OPERATEUR_PRODUCTION

```
Déclaration incident
```

Les menus non autorisés ne sont jamais affichés.

---

# Expiration du JWT

Si le backend retourne :

```
401 Unauthorized
```

le frontend doit :

- supprimer le JWT
- supprimer l'utilisateur connecté
- nettoyer React Query
- rediriger Login

---

# Rafraîchissement du token

Le backend actuel ne fournit pas de Refresh Token.

Le frontend est néanmoins conçu pour permettre son ajout ultérieur sans modifier l'architecture.

---

# Gestion des erreurs

400

```
Identifiants invalides
```

401

```
Session expirée
```

403

```
Accès interdit
```

500

```
Erreur serveur
```

Toutes les erreurs sont affichées via un composant Toast.

---

# React Query

Le profil utilisateur est chargé avec :

```
useQuery()
```

Aucune requête utilisateur ne doit être effectuée avec :

```
useEffect()
```

---

# Sécurité

Interdictions :

❌ enregistrer le mot de passe

❌ afficher le JWT

❌ modifier le JWT

❌ créer plusieurs AuthService

❌ effectuer un login directement depuis un composant

---

# Structure recommandée

```
services/

auth.service.ts

hooks/

useLogin.ts

useLogout.ts

useCurrentUser.ts

components/

ProtectedRoute.tsx

store/

authStore.ts

pages/

Login.tsx
```

---

# Tests

Les tests doivent vérifier :

✅ Login réussi

✅ Login échoué

✅ Utilisateur courant

✅ Logout

✅ Expiration JWT

✅ Route protégée

✅ RBAC

✅ Redirection automatique

---

# Références

- API_SPECIFICATION.md
- RBAC.md
- PERMISSIONS_MATRIX.md
- FRONTEND_ARCHITECTURE.md
- FRONTEND_DEVELOPMENT_RULES.md