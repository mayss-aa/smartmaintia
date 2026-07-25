# SmartMaint IA - Backend

Socle technique du backend (Sprint 1, tache 1). Aucune fonctionnalite metier
n'est encore implementee.

## Stack

- Python / FastAPI
- SQLAlchemy (ORM) + PyMySQL (driver MySQL)
- Alembic (migrations)
- Pydantic / Pydantic Settings (validation & configuration)
- JWT (PyJWT)
- CORS, logging, Swagger/OpenAPI

## Structure

```text
backend/
├── alembic/            # Migrations (env, templates, versions)
├── alembic.ini
├── app/
│   ├── api/v1/         # Routes versionnees (endpoints systeme uniquement)
│   ├── config/         # Configuration (Pydantic Settings)
│   ├── core/           # Securite (JWT) et logging
│   ├── database/       # Engine, session et Base SQLAlchemy
│   ├── dependencies/   # Dependances FastAPI injectables
│   ├── middleware/     # Logging des requetes + filet de securite erreurs
│   ├── models/         # Modeles ORM (vides pour l'instant)
│   ├── schemas/        # Schemas Pydantic (vides pour l'instant)
│   ├── services/       # Logique metier (vide pour l'instant)
│   ├── repositories/   # Acces aux donnees (vide pour l'instant)
│   ├── ai/             # Modules IA (vides pour l'instant)
│   ├── tests/          # Tests du socle
│   ├── utils/          # Utilitaires
│   └── main.py         # Point d'entree FastAPI
├── requirements.txt
├── .env.example
└── .env
```

## Installation

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # puis adapter les valeurs
```

## Lancement

```powershell
uvicorn app.main:app --reload
```

- API racine : http://localhost:8000/
- Swagger UI : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc
- Health : http://localhost:8000/api/v1/health
- Health DB : http://localhost:8000/api/v1/health/db

## Migrations (Alembic)

```powershell
alembic revision --autogenerate -m "message"
alembic upgrade head
```

La base MySQL `smartmaint_ia` doit exister et etre accessible avec les
identifiants definis dans `.env`.

## Tests

```powershell
pytest
```
