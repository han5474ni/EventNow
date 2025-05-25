import os
import psycopg2
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables from .env file
load_dotenv(override=True)

# Get database configuration from environment variables
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', 'yani12345')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

# Use the same password context as in security.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print(f"\n===== Fixing Authentication Issues in EventNow Database =====\n")

# Hash a password using the same method as in the application
def get_password_hash(password):
    return pwd_context.hash(password)

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
    
    # 1. Fix admin password with the correct hashing method
    admin_email = 'admin@eventnow.com'
    new_password = 'password'  # Simple password for testing
    hashed_password = get_password_hash(new_password)
    
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
    
    # 2. Fix user roles to ensure they're compatible with the enum
    cursor.execute("""
    SELECT id, email, role FROM users
    """)
    users = cursor.fetchall()
    
    for user in users:
        user_id, email, role = user
        # Make sure role is one of: 'ADMIN', 'STUDENT', 'GENERAL'
        if role.lower() == 'admin':
            new_role = 'ADMIN'
        elif role.lower() == 'student':
            new_role = 'STUDENT'
        else:
            new_role = 'GENERAL'
        
        cursor.execute("""
        UPDATE users
        SET role = %s
        WHERE id = %s
        """, (new_role, user_id))
        
        print(f"Updated role for user {email} from '{role}' to '{new_role}'")
    
    # 3. Add a test user with correct password hash and role
    test_email = 'test@example.com'
    test_password = 'test123'
    test_hashed_password = get_password_hash(test_password)
    
    # Check if test user exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (test_email,))
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, role, email_verified, is_active)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """, (
            test_email,
            test_hashed_password,
            'Test User',
            'GENERAL',
            True,
            True
        ))
        test_user_id = cursor.fetchone()[0]
        print(f"\nCreated test user (ID: {test_user_id})")
        print(f"Test user credentials:")
        print(f"Email: {test_email}")
        print(f"Password: {test_password}")
    
    # Commit changes
    conn.commit()
    
    # Close connection
    cursor.close()
    conn.close()
    
    print("\nAuthentication issues fixed successfully!")
    print("You can now login to the application with the updated credentials.")
    
except Exception as e:
    print(f"\nError: {str(e)}")
