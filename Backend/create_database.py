import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
import time

# Load environment variables from .env file
load_dotenv(override=True)

# Get database configuration from environment variables
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', 'yani12345')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

print(f"\n===== Creating PostgreSQL Database for EventNow =====\n")
print(f"Database configuration:")
print(f"  Name: {db_name}")
print(f"  User: {db_user}")
print(f"  Host: {db_host}")
print(f"  Port: {db_port}\n")

def create_database():
    """Create the PostgreSQL database"""
    try:
        # Connect to PostgreSQL server
        print("Connecting to PostgreSQL server...")
        conn = psycopg2.connect(
            user=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            # Connect to 'postgres' database to create a new database
            dbname="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cursor = conn.cursor()
        
        # Check if database already exists
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database '{db_name}'...")
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists.")
        
        # Close connection to postgres database
        cursor.close()
        conn.close()
        
        # Connect to the newly created database
        print(f"\nConnecting to '{db_name}' database...")
        conn = psycopg2.connect(
            user=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            dbname=db_name
        )
        cursor = conn.cursor()
        
        # Create tables for EventNow application
        print("Creating tables...")
        
        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            email_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create events table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(50) NOT NULL,
            location VARCHAR(200) NOT NULL,
            start_datetime TIMESTAMP NOT NULL,
            end_datetime TIMESTAMP NOT NULL,
            registration_deadline TIMESTAMP,
            max_participants INTEGER,
            registration_link VARCHAR(500),
            status VARCHAR(50) DEFAULT 'upcoming',
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            organizer_id INTEGER REFERENCES users(id)
        )
        """)
        
        # Create comments table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
            author_id INTEGER REFERENCES users(id)
        )
        """)
        
        # Create registrations table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS registrations (
            id SERIAL PRIMARY KEY,
            status VARCHAR(50) DEFAULT 'registered',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id)
        )
        """)
        
        # Create password_resets table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            token VARCHAR(255) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create email_verifications table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS email_verifications (
            token VARCHAR(255) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            email VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Commit changes
        conn.commit()
        print("All tables created successfully.")
        
        # Create a test admin user
        cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, role, email_verified)
        VALUES ('admin@eventnow.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin User', 'admin', TRUE)
        ON CONFLICT (email) DO NOTHING
        """)
        conn.commit()
        print("\nTest admin user created with credentials:")
        print("  Email: admin@eventnow.com")
        print("  Password: password")
        
        # Close connection
        cursor.close()
        conn.close()
        
        print("\nDatabase setup completed successfully!")
        print("You can now run the application with: python main.py")
        
        return True
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_database()
    if not success:
        sys.exit(1)
