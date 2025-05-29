"""
Database connection and status checker.

This script checks the database connection and displays information about the database state.
"""
import sys
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from typing import Dict, Any, List

# Add the project root to the Python path
import os
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from database import engine, Base

def print_section(title: str, width: int = 60) -> None:
    """Print a section header."""
    print(f"\n{' ' + title + ' ':-^{width}}")

def check_connection() -> bool:
    """Check if the database connection is working."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def get_database_info() -> Dict[str, Any]:
    """Get information about the database."""
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT version(), current_database(), current_user, current_schema()")
        ).fetchone()
        
        return {
            "version": result[0],
            "database": result[1],
            "user": result[2],
            "schema": result[3],
        }

def get_table_info() -> List[Dict[str, Any]]:
    """Get information about tables in the database."""
    inspector = inspect(engine)
    tables = []
    
    for table_name in inspector.get_table_names(schema='public'):
        table_info = {
            "name": table_name,
            "columns": [],
            "row_count": 0
        }
        
        # Get column information
        for column in inspector.get_columns(table_name, schema='public'):
            table_info["columns"].append({
                "name": column["name"],
                "type": str(column["type"]),
                "nullable": column["nullable"],
                "default": column.get("default", None),
                "primary_key": column.get("primary_key", False)
            })
        
        # Get row count
        try:
            with engine.connect() as conn:
                result = conn.execute(text(f'SELECT COUNT(*) FROM "{table_name}"'))
                table_info["row_count"] = result.scalar()
        except Exception as e:
            table_info["row_count"] = f"Error: {str(e)}"
        
        tables.append(table_info)
    
    return tables

def print_database_status() -> None:
    """Print the current database status."""
    print("🔍 Checking database status...\n")
    
    # Check connection
    if not check_connection():
        print("\n❌ Could not connect to the database. Please check your configuration.")
        return
    
    print("✅ Successfully connected to the database!\n")
    
    # Get database info
    try:
        db_info = get_database_info()
        print_section("DATABASE INFORMATION")
        print(f"PostgreSQL Version: {db_info['version']}")
        print(f"Database: {db_info['database']}")
        print(f"User: {db_info['user']}")
        print(f"Schema: {db_info['schema']}")
    except Exception as e:
        print(f"❌ Error getting database info: {e}")
    
    # Get table info
    try:
        tables = get_table_info()
        print_section("TABLES")
        
        if not tables:
            print("No tables found in the database.")
            return
            
        for table in tables:
            print(f"\n📊 Table: {table['name']} ({table['row_count']} rows)")
            print("  Columns:")
            for col in table['columns']:
                pk = " (PK)" if col['primary_key'] else ""
                nullable = " NULL" if col['nullable'] else " NOT NULL"
                default = f" DEFAULT {col['default']}" if col['default'] is not None else ""
                print(f"    - {col['name']}: {col['type']}{pk}{nullable}{default}")
    
    except Exception as e:
        print(f"❌ Error getting table info: {e}")

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("EVENTNOW DATABASE STATUS".center(60))
    print("=" * 60)
    
    print_database_status()
    
    print("\n" + "=" * 60)
    print("Database check completed.".center(60))
    print("=" * 60 + "\n")
