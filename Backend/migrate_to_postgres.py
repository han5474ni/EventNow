import os
import sys
import logging
import sqlite3
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import settings after loading environment variables
from config import settings
from urllib.parse import quote_plus
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models.base import Base
from models import *  # Import all models

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_sqlite_connection():
    """Get a connection to the SQLite database"""
    sqlite_db_path = f"{settings.DATABASE_NAME}.db"
    if not os.path.exists(sqlite_db_path):
        logger.error(f"SQLite database file not found: {sqlite_db_path}")
        return None
    
    return sqlite3.connect(sqlite_db_path)

def get_postgres_connection_string():
    """Get the PostgreSQL connection string"""
    # Properly escape the database name, username and password
    db_name = quote_plus(settings.DATABASE_NAME)
    db_user = quote_plus(settings.DATABASE_USER) if settings.DATABASE_USER else ""
    db_pass = quote_plus(settings.DATABASE_PASSWORD) if settings.DATABASE_PASSWORD else ""
    
    return f"postgresql://{db_user}:{db_pass}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{db_name}"

def get_postgres_connection():
    """Get a connection to the PostgreSQL database"""
    try:
        # Handle database names with hyphens by using quotes
        db_name = settings.DATABASE_NAME
        
        # Build connection string manually to handle special characters
        conn_string = f"host={settings.DATABASE_HOST} port={settings.DATABASE_PORT} user={settings.DATABASE_USER} password={settings.DATABASE_PASSWORD} dbname={db_name}"
        logger.info(f"Connecting to PostgreSQL with: host={settings.DATABASE_HOST} port={settings.DATABASE_PORT} user={settings.DATABASE_USER} dbname={db_name}")
        
        conn = psycopg2.connect(conn_string)
        return conn
    except Exception as e:
        logger.error(f"Error connecting to PostgreSQL: {str(e)}")
        return None

def get_sqlite_tables(conn):
    """Get a list of tables in the SQLite database"""
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return tables

def get_table_schema(conn, table_name):
    """Get the schema for a table in SQLite"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    cursor.close()
    return columns

def get_table_data(conn, table_name):
    """Get all data from a table in SQLite"""
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    cursor.close()
    return data

def create_postgres_tables():
    """Create tables in PostgreSQL using SQLAlchemy models"""
    # Create SQLAlchemy engine for PostgreSQL
    engine = create_engine(get_postgres_connection_string())
    
    # Create all tables defined in the models
    Base.metadata.create_all(engine)
    
    return engine

def migrate_data(sqlite_conn, postgres_conn):
    """Migrate data from SQLite to PostgreSQL"""
    # Get list of tables from SQLite
    tables = get_sqlite_tables(sqlite_conn)
    logger.info(f"Found tables in SQLite: {tables}")
    
    # For each table, migrate data to PostgreSQL
    postgres_cursor = postgres_conn.cursor()
    
    for table_name in tables:
        try:
            # Get table schema
            schema = get_table_schema(sqlite_conn, table_name)
            column_names = [col[1] for col in schema]
            logger.info(f"Migrating table: {table_name} with columns: {column_names}")
            
            # Get table data
            data = get_table_data(sqlite_conn, table_name)
            logger.info(f"Found {len(data)} rows in table {table_name}")
            
            if not data:
                logger.info(f"No data to migrate for table {table_name}")
                continue
            
            # Prepare column names for PostgreSQL query
            columns_str = ", ".join(column_names)
            placeholders = ", ".join([f"%s" for _ in column_names])
            
            # Insert data into PostgreSQL
            for row in data:
                try:
                    query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
                    postgres_cursor.execute(query, row)
                except Exception as e:
                    logger.error(f"Error inserting row into {table_name}: {str(e)}")
                    continue
            
            postgres_conn.commit()
            logger.info(f"Successfully migrated data for table {table_name}")
            
        except Exception as e:
            logger.error(f"Error migrating table {table_name}: {str(e)}")
            continue
    
    postgres_cursor.close()

def main():
    # Check if PostgreSQL credentials are provided
    logger.info(f"Database type: {settings.DATABASE_TYPE}")
    logger.info(f"Database name: {settings.DATABASE_NAME}")
    logger.info(f"Database user: {settings.DATABASE_USER}")
    logger.info(f"Database host: {settings.DATABASE_HOST}")
    logger.info(f"Database port: {settings.DATABASE_PORT}")
    
    if settings.DATABASE_TYPE.lower() != 'postgresql':
        logger.error("Database type is not set to PostgreSQL. Please update the .env file.")
        logger.info("Example .env configuration for PostgreSQL:")
        logger.info("DATABASE_TYPE=postgresql")
        logger.info("DATABASE_NAME=your_database_name")
        logger.info("DATABASE_USER=your_username")
        logger.info("DATABASE_PASSWORD=your_password")
        logger.info("DATABASE_HOST=localhost")
        logger.info("DATABASE_PORT=5432")
        return False
    
    # Get SQLite connection
    sqlite_conn = get_sqlite_connection()
    if not sqlite_conn:
        return False
    
    # Get PostgreSQL connection
    postgres_conn = get_postgres_connection()
    if not postgres_conn:
        sqlite_conn.close()
        return False
    
    try:
        # Create tables in PostgreSQL
        logger.info("Creating tables in PostgreSQL...")
        engine = create_postgres_tables()
        
        # Migrate data
        logger.info("Migrating data from SQLite to PostgreSQL...")
        migrate_data(sqlite_conn, postgres_conn)
        
        logger.info("Migration completed successfully!")
        return True
    except Exception as e:
        logger.error(f"Error during migration: {str(e)}")
        return False
    finally:
        # Close connections
        sqlite_conn.close()
        postgres_conn.close()

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
