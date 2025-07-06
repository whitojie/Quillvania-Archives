from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file (e.g., your database URL)
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("URL_DATABASE")

# Create a database engine using the URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
# Create a session factory for interacting with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Create a base class for ORM models to inherit from
Base = declarative_base()


# Dependency to get a new database session for each request
def get_db():
    db = SessionLocal()  # Provide the session to the caller (FastAPI route)
    try:
        yield db
    finally:
        db.close()

