from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
GOOGLE_CLOUD_SQL_CONNECTION_NAME = os.getenv("GOOGLE_CLOUD_SQL_CONNECTION_NAME")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME", "business_intelligence")

# Google Cloud SQL configuration
if GOOGLE_CLOUD_SQL_CONNECTION_NAME and DB_PASSWORD:
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?host=/cloudsql/{GOOGLE_CLOUD_SQL_CONNECTION_NAME}"
    print(f"Using Google Cloud SQL: {GOOGLE_CLOUD_SQL_CONNECTION_NAME}")
elif DATABASE_URL:
    # Existing Neon or other PostgreSQL setup
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    print("Using configured DATABASE_URL")
else:
    # Fallback for local development
    DATABASE_URL = "sqlite:///./sql_app.db"
    print("Using local SQLite database")

# Connection arguments based on database type
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
elif "neon.tech" in DATABASE_URL or "postgresql" in DATABASE_URL:
    connect_args = {"sslmode": "require"} if "neon.tech" in DATABASE_URL else {}

# Create engine with retry logic for cloud connections
engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    echo=False  # Set to True for SQL debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check function for database connectivity
def check_db_connection():
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
