from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from typing import Generator

# Load environment variables from .env file
load_dotenv(override=True)

# Database configuration - Using SQLite by default for development
# To use PostgreSQL, set DATABASE_TYPE=postgresql and provide the necessary credentials in .env
DATABASE_TYPE = os.getenv('DATABASE_TYPE', 'sqlite')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'eventnow')

# Build connection URL
if DATABASE_TYPE.lower() == 'postgresql':
    # PostgreSQL configuration
    DATABASE_USER = os.getenv('DATABASE_USER', 'postgres')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', '')
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_PORT = os.getenv('DATABASE_PORT', '5432')
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
else:
    # SQLite configuration (default)
    SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DATABASE_NAME}.db"

# Create SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Enable connection health checks
    pool_recycle=300,     # Recycle connections after 5 minutes
    pool_size=5,          # Number of connections to keep open
    max_overflow=10,      # Number of connections to allow in overflow
    echo=False            # Set to True for SQL query logging
)

print(f"Using {DATABASE_TYPE} database: {DATABASE_NAME} on {DATABASE_HOST}:{DATABASE_PORT}")

# Create a SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create database tables"""
    from models.base import Base
    Base.metadata.create_all(bind=engine)

# Import all models to ensure they are registered with SQLAlchemy
# This must be done after Base is defined
from models import *  # noqa
