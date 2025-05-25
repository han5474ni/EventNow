import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

# Get database configuration from environment variables
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', 'yani12345')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

print(f"\n===== Fixing User Roles in EventNow Database =====\n")

try:
    # Connect to the database
    conn = psycopg2.connect(
        user=db_user,
        password=db_pass,
        host=db_host,
        port=db_port,
        dbname=db_name
    )
    cursor = conn.cursor()
    
    # Create a temporary table to store user roles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_roles (
        name VARCHAR(50) PRIMARY KEY
    )
    """)
    
    # Insert the enum values
    cursor.execute("""
    INSERT INTO user_roles (name) VALUES ('admin'), ('student'), ('general')
    ON CONFLICT (name) DO NOTHING
    """)
    
    # Update user table schema to use enum
    cursor.execute("""
    ALTER TABLE users 
    ALTER COLUMN role TYPE VARCHAR(50)
    """)
    
    # Commit changes
    conn.commit()
    print("User roles fixed successfully!")
    
    # Check users table
    cursor.execute("SELECT id, email, role FROM users")
    users = cursor.fetchall()
    
    if users:
        print(f"\nCurrent users:")
        for user in users:
            print(f"ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")
    
    # Close connection
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"\nError: {str(e)}")
