import sys
import os
sys.path.insert(0, os.getcwd())
from sqlalchemy import text
from api.database import engine

def check_schema():
    print("🔍 Checking database schema for 'payment_history'...")
    with engine.connect() as conn:
        try:
            # PostgreSQL specific query to list columns
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'payment_history'
            """))
            columns = result.fetchall()
            print(f"✅ Found {len(columns)} columns in 'payment_history':")
            for col in columns:
                print(f"   - {col[0]} ({col[1]})")
            
            # Now try to force add dodo_payment_id if missing
            column_names = [c[0] for c in columns]
            if 'dodo_payment_id' not in column_names:
                print("🚨 MISSING dodo_payment_id! Attempting to add...")
                conn.execute(text("ALTER TABLE payment_history ADD COLUMN dodo_payment_id VARCHAR"))
                conn.commit()
                print("✅ Added dodo_payment_id")
            else:
                print("ℹ️ dodo_payment_id already present")

        except Exception as e:
            print(f"❌ Schema check failed: {e}")

if __name__ == "__main__":
    check_schema()
