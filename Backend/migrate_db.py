import os
import sys
import sqlite3
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

# Add the current directory to the path so we can import our models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import settings
from models import Base

# Get database configuration from environment variables
database_type = os.getenv('DATABASE_TYPE', 'sqlite').lower()
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', '')
db_pass = os.getenv('DATABASE_PASSWORD', '')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

print(f"Database type from environment: {database_type}")

# Create database engine based on type
if database_type == 'postgresql':
    # PostgreSQL connection
    DATABASE_URL = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    engine = create_engine(DATABASE_URL)
    print(f"Using PostgreSQL database: {db_name}")
else:
    # SQLite connection
    DATABASE_URL = f"sqlite:///./eventnow.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"Using SQLite database: eventnow.db")

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def migrate_database():
    print("Starting database migration...")
    
    try:
        # Create a session
        db = SessionLocal()
        
        if database_type == 'postgresql':
            # For PostgreSQL, we'll use SQLAlchemy to create all tables
            print("Creating tables in PostgreSQL...")
            Base.metadata.create_all(bind=engine)
            print("All tables created in PostgreSQL database.")
            
        else:  # SQLite migration
            # Get the database file path
            db_path = "./eventnow.db"
            
            # Connect to the SQLite database directly
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if email_verified column exists in users table
            cursor.execute("PRAGMA table_info(users)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'email_verified' not in columns:
                print("Adding 'email_verified' column to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0")
                conn.commit()
                print("Column 'email_verified' added successfully.")
            else:
                print("Column 'email_verified' already exists.")
            
            # Create the password_resets table if it doesn't exist
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS password_resets (
                token VARCHAR PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """)
            conn.commit()
            print("Table 'password_resets' created or already exists.")
            
            # Create the email_verifications table if it doesn't exist
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS email_verifications (
                token VARCHAR PRIMARY KEY,
                user_id INTEGER NOT NULL,
                email VARCHAR NOT NULL,
                is_verified BOOLEAN DEFAULT 0,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """)
            conn.commit()
            print("Table 'email_verifications' created or already exists.")
            
            # Close SQLite connection
            conn.close()
        
        # Create all tables defined in the models
        print("Creating any missing tables from models...")
        Base.metadata.create_all(bind=engine)
        print("All tables created.")
        
        print("Database migration completed successfully.")
        
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        # Close the session
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    migrate_database()
