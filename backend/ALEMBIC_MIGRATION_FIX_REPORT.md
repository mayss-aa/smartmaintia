# Alembic Migration Fix Report

**Date:** July 18, 2026  
**Status:** ✅ **FIXED**

## Problem Analysis

### Initial State:
- **Alembic reported:** Database at head (`f26b9a6ae4cd`)
- **Actual database:** Only contained `alembic_version` table
- **Migration inconsistency:** Last two migrations were recreating ALL tables instead of only new ones

### Root Cause:
The last two migrations (`b6d3ce74a343` and `f26b9a6ae4cd`) were auto-generated incorrectly:

1. **Migration `b6d3ce74a343`** (historique_global):
   - Should have only created `historique_global` table
   - Was incorrectly recreating ALL tables: `utilisateur`, `banc_test_bdd`, `ticket_maintenance`, `intervention`, `historique_global`

2. **Migration `f26b9a6ae4cd`** (alerte_predictive):
   - Should have only created `alerte_predictive` table and added foreign key to `intervention`
   - Was incorrectly recreating ALL tables: `utilisateur`, `banc_test_bdd`, `ticket_maintenance`, `intervention`, `historique_global`, `alerte_predictive`

## Fix Applied

### 1. **Corrected Migration Files:**

#### **Migration `b6d3ce74a343` (historique_global):**
**BEFORE:** Created 5 tables (including duplicates of existing ones)
**AFTER:** Only creates:
- `historique_global` table with proper foreign keys
- Indexes for query performance: `ix_historique_global_code_banc`, `ix_historique_global_id_intervention`, `ix_historique_global_date_cloture`

#### **Migration `f26b9a6ae4cd` (alerte_predictive):**
**BEFORE:** Created 6 tables (including duplicates of existing ones)
**AFTER:** Only creates:
- `alerte_predictive` table with proper foreign key to `banc_test_bdd`
- Indexes for query performance: `ix_alerte_predictive_code_banc`, `ix_alerte_predictive_date_detection`, `ix_alerte_predictive_statut_alerte`
- Adds foreign key constraint to `intervention` table: `fk_intervention_id_alerte_alerte_predictive`

### 2. **Migration History Reset:**
- Cleared `alembic_version` table
- Applied all migrations from scratch in correct order:
  1. `0001_create_utilisateur` → Creates `utilisateur` table
  2. `0002_create_banc_test_bdd` → Creates `banc_test_bdd` table
  3. `0003_create_ticket_intervention` → Creates `ticket_maintenance` and `intervention` tables
  4. `b6d3ce74a343` → Creates `historique_global` table
  5. `f26b9a6ae4cd` → Creates `alerte_predictive` table and adds foreign key to `intervention`

## Verification Results

### ✅ **Migration Order Verified:**
```
<base> -> 0001_create_utilisateur (create utilisateur table)
0001_create_utilisateur -> 0002_create_banc_test_bdd (create banc_test_bdd table)
0002_create_banc_test_bdd -> 0003_create_ticket_intervention (create_ticket_intervention)
0003_create_ticket_intervention -> b6d3ce74a343 (create_historique_global - CORRECTED VERSION)
b6d3ce74a343 -> f26b9a6ae4cd (create_alerte_predictive_table - CORRECTED VERSION)
```

### ✅ **Database Schema Verified:**
**Total Tables:** 7
1. `alembic_version` - Alembic migration tracking
2. `utilisateur` - Users table
3. `banc_test_bdd` - Test benches table
4. `ticket_maintenance` - Maintenance tickets table
5. `intervention` - Interventions table
6. `historique_global` - History records table
7. `alerte_predictive` - Predictive alerts table

### ✅ **Fresh Database Test Passed:**
- All tables dropped and recreated from scratch successfully
- All 7 tables created in correct dependency order
- Alembic version correctly set to `f26b9a6ae4cd` (head)

## Key Improvements

### **Each Migration Now Only Creates:**
1. **0001:** Only `utilisateur` table
2. **0002:** Only `banc_test_bdd` table  
3. **0003:** Only `ticket_maintenance` and `intervention` tables
4. **b6d3ce74a343:** Only `historique_global` table
5. **f26b9a6ae4cd:** Only `alerte_predictive` table + foreign key to `intervention`

### **Dependency Order Maintained:**
- `ticket_maintenance` depends on `banc_test_bdd`
- `intervention` depends on `utilisateur` and `ticket_maintenance`
- `historique_global` depends on `banc_test_bdd` and `intervention`
- `alerte_predictive` depends on `banc_test_bdd`
- `intervention` has optional foreign key to `alerte_predictive`

## Next Steps

1. **Create demo users:** Now that tables exist, create persistent demo users
2. **Run tests:** Verify all tests pass with the corrected database schema
3. **API testing:** Test all endpoints work with the proper database structure

## Files Modified

### **Deleted (Incorrect):**
- `alembic/versions/20260716_1726_b6d3ce74a343_create_historique_global.py`
- `alembic/versions/20260716_1857_f26b9a6ae4cd_create_alerte_predictive_table.py`

### **Created (Corrected):**
- `alembic/versions/20260716_1726_b6d3ce74a343_create_historique_global.py` (corrected)
- `alembic/versions/20260716_1857_f26b9a6ae4cd_create_alerte_predictive_table.py` (corrected)

## Conclusion

✅ **MIGRATION INCONSISTENCY FIXED**

The Alembic migration history has been completely repaired. Each migration now only creates the database objects introduced in that revision, and a fresh database can be successfully created using `python -m alembic upgrade head`.

The database now contains all 7 expected tables in the correct dependency order, matching the ERD.md documentation.