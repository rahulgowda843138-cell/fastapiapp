from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()

# Use DATABASE_URL from environment if available (like on Render), otherwise use localhost
_DB_URL = os.getenv("DATABASE_URL", "").strip().strip('"').strip("'")
if not _DB_URL:
    _DB_URL = "postgresql://postgres:abmin123@localhost:5432/student_db"

# SQLAlchemy 1.4+ requires "postgresql://" instead of "postgres://"
if _DB_URL.startswith("postgres://"):
    _DB_URL = _DB_URL.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = _DB_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

