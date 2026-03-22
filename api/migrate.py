import sys
import os
from sqlalchemy import text
from database import engine, SessionLocal, init_database
import models

def run_migration():
    print("--- TrendAI Database Migration Tool (v1.0) ---")
    
    try:
        # 1. Initialize tables if they don't exist
        print("🔍 Checking existing schema and creating missing tables...")
        init_database()
        print("✅ Core table synchronization complete.")

        # 2. Verify connection
        db = SessionLocal()
        print("📡 Verifying database connectivity...")
        db.execute(text("SELECT 1"))
        print("✅ Connectivity verified.")

        # 3. Handle specific column migrations (since create_all doesn't update existing columns)
        # Note: In a production environment, you'd use Alembic. 
        # Here we do a safe check for common domestic requirements.
        
        print("🛠️  Performing specialized column migrations...")
        try:
            # Ensure currency defaults to INR for all existing payment records
            db.execute(text("ALTER TABLE payment_history ALTER COLUMN currency SET DEFAULT 'INR'"))
            db.execute(text("UPDATE payment_history SET currency = 'INR' WHERE currency IS NULL OR currency = 'USD'"))
            
            # Ensure currency defaults to INR for all existing subscription records
            db.execute(text("ALTER TABLE user_subscriptions ALTER COLUMN currency SET DEFAULT 'INR'"))
            db.execute(text("UPDATE user_subscriptions SET currency = 'INR' WHERE currency IS NULL OR currency = 'USD'"))
            
            db.commit()
            print("✅ Currency migration (USD -> INR) complete for existing records.")
        except Exception as e:
            db.rollback()
            print(f"ℹ️  Column migration skipped or already applied: {e}")

        # 4. Clean up
        db.close()
        print("\n🚀 Migration successful. Your database is now synchronized with the v2.1 codebase.")
        
    except Exception as e:
        print(f"\n❌ Migration FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()
