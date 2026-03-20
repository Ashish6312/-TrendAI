import sqlalchemy
from database import engine

try:
    with engine.connect() as conn:
        conn.execute(sqlalchemy.text("DELETE FROM roadmaps;"))
        conn.commit()
    print("Successfully cleared all stale roadmap generations.")
except Exception as e:
    print(f"Clear error: {e}")
