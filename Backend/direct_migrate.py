import os
import sys
import logging
import sqlite3
import psycopg2

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration - hardcoded for direct migration
SQLITE_DB_PATH = "eventnow.db"
PG_DBNAME = "event-now"
PG_USER = "postgres"

# Ask for password interactively for security
from getpass import getpass
PG_PASSWORD = getpass("Enter PostgreSQL password for user 'postgres': ")

PG_HOST = "localhost"
PG_PORT = "5432"

def get_sqlite_connection():
    """Get a connection to the SQLite database"""
    if not os.path.exists(SQLITE_DB_PATH):
        logger.error(f"SQLite database file not found: {SQLITE_DB_PATH}")
        return None
    
    return sqlite3.connect(SQLITE_DB_PATH)

def get_postgres_connection():
    """Get a connection to the PostgreSQL database"""
    try:
        conn_string = f"host={PG_HOST} port={PG_PORT} user={PG_USER} password={PG_PASSWORD} dbname={PG_DBNAME}"
        logger.info(f"Connecting to PostgreSQL with: host={PG_HOST} port={PG_PORT} user={PG_USER} dbname={PG_DBNAME}")
        
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

def create_postgres_table(pg_conn, table_name, columns):
    """Create a table in PostgreSQL based on SQLite schema"""
    cursor = pg_conn.cursor()
    
    # Map SQLite types to PostgreSQL types
    type_mapping = {
        'INTEGER': 'INTEGER',
        'REAL': 'FLOAT',
        'TEXT': 'TEXT',
        'BLOB': 'BYTEA',
        'BOOLEAN': 'BOOLEAN',
        'DATETIME': 'TIMESTAMP',
        'DATE': 'DATE',
        'TIME': 'TIME',
        '': 'TEXT'  # Default type
    }
    
    # Build CREATE TABLE statement
    column_defs = []
    for col in columns:
        col_id, col_name, col_type, not_null, default_val, is_pk = col
        
        # Map SQLite type to PostgreSQL type
        pg_type = type_mapping.get(col_type.upper(), 'TEXT')
        
        # Build column definition
        col_def = f'"{col_name}" {pg_type}'
        
        # Add constraints
        if is_pk:
            col_def += " PRIMARY KEY"
        if not_null:
            col_def += " NOT NULL"
        if default_val is not None:
            col_def += f" DEFAULT {default_val}"
        
        column_defs.append(col_def)
    
    # Create table
    create_table_sql = f"CREATE TABLE IF NOT EXISTS {table_name} (\n  {',\n  '.join(column_defs)}\n);"
    logger.info(f"Creating table {table_name} with SQL:\n{create_table_sql}")
    
    try:
        cursor.execute(create_table_sql)
        pg_conn.commit()
        logger.info(f"Table {table_name} created successfully")
        return True
    except Exception as e:
        logger.error(f"Error creating table {table_name}: {str(e)}")
        pg_conn.rollback()
        return False

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
            
            # Create table in PostgreSQL
            if not create_postgres_table(postgres_conn, table_name, schema):
                logger.error(f"Skipping data migration for table {table_name} due to schema creation error")
                continue
            
            # Get table data
            data = get_table_data(sqlite_conn, table_name)
            logger.info(f"Found {len(data)} rows in table {table_name}")
            
            if not data:
                logger.info(f"No data to migrate for table {table_name}")
                continue
            
            # Prepare column names for PostgreSQL query
            columns_str = ", ".join([f'"{col}"' for col in column_names])
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
    # Get SQLite connection
    logger.info(f"Opening SQLite database: {SQLITE_DB_PATH}")
    sqlite_conn = get_sqlite_connection()
    if not sqlite_conn:
        return False
    
    # Get PostgreSQL connection
    logger.info(f"Connecting to PostgreSQL database: {PG_DBNAME}")
    postgres_conn = get_postgres_connection()
    if not postgres_conn:
        sqlite_conn.close()
        return False
    
    try:
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
