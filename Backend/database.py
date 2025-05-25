from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create SQLAlchemy engine
from urllib.parse import quote_plus

# Force reload environment variables to ensure we have the latest settings
from dotenv import load_dotenv
load_dotenv(override=True)

# Get database type from environment variable directly
import os
database_type = os.getenv('DATABASE_TYPE', 'sqlite').lower()
print(f"Database type from environment: {database_type}")

if database_type == 'postgresql':
    # Use PostgreSQL connection
    # Get database settings directly from environment variables
    db_name = os.getenv('DATABASE_NAME', 'postgres')
    db_user = os.getenv('DATABASE_USER', 'postgres')
    db_pass = os.getenv('DATABASE_PASSWORD', '')
    db_host = os.getenv('DATABASE_HOST', 'localhost')
    db_port = os.getenv('DATABASE_PORT', '5432')
    
    print(f"PostgreSQL settings: name={db_name}, user={db_user}, host={db_host}, port={db_port}")
    
    # Build connection URL
    SQLALCHEMY_DATABASE_URL = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    
    # Create engine without SQLite-specific connect_args
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    print(f"Using PostgreSQL database: {db_name}")
else:
    # Use SQLite connection
    db_name = os.getenv('DATABASE_NAME', 'eventnow')
    SQLALCHEMY_DATABASE_URL = f"sqlite:///./{db_name}.db"
    
    # Create engine with SQLite-specific connect_args
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}  # Only needed for SQLite
    )
    
    print(f"Using SQLite database: {db_name}.db")

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
