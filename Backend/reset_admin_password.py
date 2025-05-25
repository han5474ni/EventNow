import os
import psycopg2
from dotenv import load_dotenv
import bcrypt

# Load environment variables from .env file
load_dotenv(override=True)

# Get database configuration from environment variables
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', 'yani12345')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

print(f"\n===== Resetting Admin Password in EventNow Database =====\n")

# Hash a password
def hash_password(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

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
    
    # Reset admin password
    admin_email = 'admin@eventnow.com'
    new_password = 'admin123'
    hashed_password = hash_password(new_password)
    
    # Update admin password
    cursor.execute("""
    UPDATE users 
    SET hashed_password = %s 
    WHERE email = %s
    RETURNING id
    """, (hashed_password, admin_email))
    
    result = cursor.fetchone()
    if result:
        user_id = result[0]
        print(f"Password reset for admin user (ID: {user_id})")
        print(f"\nNew admin credentials:")
        print(f"Email: {admin_email}")
        print(f"Password: {new_password}")
    else:
        print(f"Admin user with email {admin_email} not found")
        
        # Create admin user if not exists
        print("\nCreating new admin user...")
        hashed_password = hash_password(new_password)
        cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, role, email_verified, is_active)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """, (
            admin_email,
            hashed_password,
            'Admin User',
            'admin',
            True,
            True
        ))
        user_id = cursor.fetchone()[0]
        print(f"Created new admin user (ID: {user_id})")
        print(f"\nNew admin credentials:")
        print(f"Email: {admin_email}")
        print(f"Password: {new_password}")
    
    # Commit changes
    conn.commit()
    
    # Close connection
    cursor.close()
    conn.close()
    
    print("\nPassword reset completed successfully!")
    print("You can now login to the application with the new credentials.")
    
except Exception as e:
    print(f"\nError: {str(e)}")
