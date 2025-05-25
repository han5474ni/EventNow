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

print(f"\n===== Checking Users in EventNow Database =====\n")

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
    
    # Check users table
    cursor.execute("SELECT id, email, hashed_password, full_name, role, email_verified FROM users")
    users = cursor.fetchall()
    
    if not users:
        print("No users found in the database.")
    else:
        print(f"Found {len(users)} users in the database:")
        for user in users:
            print(f"\nID: {user[0]}")
            print(f"Email: {user[1]}")
            print(f"Password Hash: {user[2][:20]}...")
            print(f"Full Name: {user[3]}")
            print(f"Role: {user[4]}")
            print(f"Email Verified: {user[5]}")
    
    # Close connection
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"\nError: {str(e)}")
