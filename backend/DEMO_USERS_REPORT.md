# Persistent Demo Users Created

**Date:** July 18, 2026  
**Status:** ✅ **CREATED**

## Database Migration Status
- ✅ Alembic migration inconsistency fixed
- ✅ All 7 database tables created successfully
- ✅ Database at head: `f26b9a6ae4cd`

## Demo User Accounts Created

### 1. Administrator
- **Email:** `admin@example.com` (updated from `admin@smartmaint.local`)
- **Password:** `Admin123!`
- **Role:** `ADMINISTRATEUR`
- **Database ID:** 1
- **Name:** System Admin
- **Verification:** ✅ Updated in MySQL database `utilisateur` table
- **Email Validation:** ✅ Valid domain for EmailStr validation

### 2. Maintenance Manager
- **Email:** `manager@example.com` (updated from `manager@smartmaint.local`)
- **Password:** `Manager123!`
- **Role:** `MANAGER_MAINTENANCE`
- **Database ID:** 2
- **Name:** Maintenance Manager
- **Verification:** ✅ Updated in MySQL database `utilisateur` table
- **Email Validation:** ✅ Valid domain for EmailStr validation

### 3. Technician
- **Email:** `technicien@example.com` (updated from `technicien@smartmaint.local`)
- **Password:** `Tech123!`
- **Role:** `TECHNICIEN`
- **Database ID:** 3
- **Name:** Test Technicien
- **Verification:** ✅ Updated in MySQL database `utilisateur` table
- **Email Validation:** ✅ Valid domain for EmailStr validation

### 4. Production Operator
- **Email:** `operateur@example.com` (updated from `operateur@smartmaint.local`)
- **Password:** `Operateur123!`
- **Role:** `OPERATEUR_PRODUCTION`
- **Database ID:** 4
- **Name:** Production Opérateur
- **Verification:** ✅ Updated in MySQL database `utilisateur` table
- **Email Validation:** ✅ Valid domain for EmailStr validation

## Security Implementation

### Password Hashing:
- ✅ Used existing `hash_password()` function from `app.core.security`
- ✅ Passwords hashed with bcrypt (industry standard)
- ✅ Hash examples stored in database:
  - `Admin123!` → `$2b$12$/2EzxAEO3d0wvqRpU3ets.pXd/9Iidu5vDB4ocO1HVf2XhmMolhSy`
  - `Manager123!` → `$2b$12$G8mSobUDgsPXogo6zHQOveJkyVBW.E5zQGHmRKQr5lrNaU0k.C6j2`
  - `Tech123!` → `$2b$12$aYLD4UTTPO6InmFVPXNXvumtiWOYLV9f3Rd1.mUu69ogybWxPuI56`
  - `Operateur123!` → `$2b$12$43z6kfogNd4ZgHoRQycqDehtKorIypIt0LHjBKuFnaAZ4o4JGLNgW`

### Database Verification:
```sql
-- All users in database:
SELECT id_user, email, role FROM utilisateur ORDER BY id_user;

-- Result:
-- id_user | email                      | role
-- 1       | admin@example.com          | ADMINISTRATEUR
-- 2       | manager@example.com        | MANAGER_MAINTENANCE
-- 3       | technicien@example.com     | TECHNICIEN
-- 4       | operateur@example.com      | OPERATEUR_PRODUCTION
```

## Authentication Testing Instructions

### 1. Start FastAPI Server:
```bash
cd e:\SmartMaint-IA\backend
python -m uvicorn app.main:app --reload
```

### 2. Test Authentication (Using curl or Postman):

#### Login Endpoint: `POST /api/v1/auth/login`
```bash
# Administrator
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Admin123!"}'

# Maintenance Manager
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "manager@example.com", "password": "Manager123!"}'

# Technician
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "technicien@example.com", "password": "Tech123!"}'

# Production Operator
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "operateur@example.com", "password": "Operateur123!"}'
```

#### Get Current User: `GET /api/v1/auth/me`
```bash
# Use token from login response
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Dashboard Access: `GET /api/v1/dashboard/`
```bash
# Should work for Admin and Manager only
curl -X GET http://localhost:8000/api/v1/dashboard/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Email Validation Compliance

### ✅ **EmailStr Validation:**
- The login endpoint uses `EmailStr` from Pydantic for email validation
- `.local` domains are **NOT** valid for `EmailStr` validation
- `.example.com` domains **ARE** valid for `EmailStr` validation
- All demo users now use valid email addresses that pass `EmailStr` validation

### ✅ **Authentication Logic Unchanged:**
- No changes to `app/schemas/auth.py` 
- No changes to `app/core/security.py`
- No changes to email validation logic
- Only database records updated

## Expected Results

### ✅ **All Users Should:**
1. Successfully authenticate via `POST /api/v1/auth/login`
2. Receive JWT access token
3. Access their own profile via `GET /api/v1/auth/me`

### ✅ **Dashboard Access (RBAC Verification):**
- **Administrator:** ✅ Can access dashboard
- **Maintenance Manager:** ✅ Can access dashboard
- **Technician:** ❌ Cannot access dashboard (403 Forbidden)
- **Production Operator:** ❌ Cannot access dashboard (403 Forbidden)

## Database Schema Status

### ✅ **All Tables Created:**
1. `alembic_version` - Migration tracking
2. `utilisateur` - Users (4 demo users created)
3. `banc_test_bdd` - Test benches (empty)
4. `ticket_maintenance` - Tickets (empty)
5. `intervention` - Interventions (empty)
6. `historique_global` - History records (empty)
7. `alerte_predictive` - Predictive alerts (empty)

### ✅ **Relationships Established:**
- Foreign keys correctly defined between tables
- ENUM types created for roles and statuses
- Indexes created for performance

## Next Steps

1. **Test API Endpoints:** Use the demo users to test all REST API endpoints
2. **Create Test Data:** Add sample data to other tables (bancs, tickets, interventions)
3. **Verify RBAC:** Test that permissions matrix is correctly implemented
4. **Dashboard Testing:** Verify dashboard aggregates data correctly

## Files Created/Modified

### **Migration Fix:**
- `ALEMBIC_MIGRATION_FIX_REPORT.md` - Detailed fix report
- Corrected migration files in `alembic/versions/`

### **User Creation:**
- Users created directly in MySQL database using existing security functions
- No test fixtures or in-memory users created
- All users are persistent and will survive server restarts

---

**✅ DEMO USERS READY FOR TESTING**