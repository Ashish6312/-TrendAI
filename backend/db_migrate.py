import sqlalchemy
from database import engine

try:
    with engine.connect() as conn:
        conn.execute(sqlalchemy.text("ALTER TABLE roadmaps ADD COLUMN current_step INTEGER DEFAULT 0;"))
        conn.commit()
    print("Successfully added current_step to roadmaps.")
except Exception as e:
    print(f"Migration error: {e}")
