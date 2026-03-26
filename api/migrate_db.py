import sys
import os

# Add current directory to path
sys.path.insert(0, os.getcwd())

from sqlalchemy import text
from api.database import engine
# import api.models # Just to ensure models are loaded if needed

def migrate():
    print("🚀 Starting database migration...")
    
    # List of columns to potentially add
    migrations = [
        # Table: payment_history
        ("payment_history", "dodo_payment_id", "VARCHAR"),
        ("payment_history", "failure_reason", "VARCHAR"),
        ("payment_history", "refund_amount", "NUMERIC(10, 2)"),
        ("payment_history", "refund_date", "TIMESTAMP WITH TIME ZONE"),
        ("payment_history", "invoice_url", "VARCHAR"),
        # Table: user_subscriptions
        ("user_subscriptions", "dodo_subscription_id", "VARCHAR"),
        ("user_subscriptions", "dodo_customer_id", "VARCHAR"),
    ]
    
    # Also add user_id to payment_history if missing
    migrations.append(("payment_history", "user_id", "INTEGER"))
    
    with engine.connect() as conn:
        for table, column, col_type in migrations:
            try:
                print(f"Adding {column} to {table}...")
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                conn.commit()
                print(f"✅ Added column {column} to {table}")
            except Exception as e:
                # If it already exists, it will error - that's fine
                e_str = str(e).lower()
                if "already exists" in e_str or "duplicate" in e_str:
                    print(f"ℹ️ Column {column} already exists in {table}")
                else:
                    print(f"❌ Error adding {column} to {table}: {e}")
        
    print("🏁 Migration complete.")

if __name__ == "__main__":
    migrate()
