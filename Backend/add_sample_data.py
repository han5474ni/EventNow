import os
import psycopg2
from datetime import datetime, timedelta
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

print(f"\n===== Adding Sample Data to EventNow Database =====\n")

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
    
    # Add sample users if they don't exist
    sample_users = [
        {
            'email': 'user@example.com',
            'password': 'password123',
            'full_name': 'Regular User',
            'role': 'general',
            'email_verified': True
        },
        {
            'email': 'student@example.com',
            'password': 'password123',
            'full_name': 'Student User',
            'role': 'student',
            'email_verified': True
        }
    ]
    
    for user in sample_users:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user['email'],))
        if not cursor.fetchone():
            hashed_password = hash_password(user['password'])
            cursor.execute("""
            INSERT INTO users (email, hashed_password, full_name, role, email_verified, is_active, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """, (
                user['email'],
                hashed_password,
                user['full_name'],
                user['role'],
                user['email_verified'],
                True,
                datetime.utcnow(),
                datetime.utcnow()
            ))
            user_id = cursor.fetchone()[0]
            print(f"Added user: {user['email']} (ID: {user_id})")
        else:
            print(f"User {user['email']} already exists")
    
    # Add sample events
    now = datetime.utcnow()
    sample_events = [
        {
            'title': 'Tech Conference 2025',
            'description': 'A conference about the latest technology trends and innovations.',
            'category': 'Technology',
            'location': 'Jakarta Convention Center',
            'start_datetime': now + timedelta(days=30),
            'end_datetime': now + timedelta(days=32),
            'registration_deadline': now + timedelta(days=25),
            'max_participants': 500,
            'status': 'upcoming',
            'is_featured': True
        },
        {
            'title': 'Web Development Workshop',
            'description': 'Learn the basics of web development with HTML, CSS, and JavaScript.',
            'category': 'Workshop',
            'location': 'Online',
            'start_datetime': now + timedelta(days=7),
            'end_datetime': now + timedelta(days=7, hours=4),
            'registration_deadline': now + timedelta(days=5),
            'max_participants': 50,
            'status': 'upcoming',
            'is_featured': True
        },
        {
            'title': 'Data Science Bootcamp',
            'description': 'Intensive bootcamp to learn data science and machine learning.',
            'category': 'Education',
            'location': 'Bandung Tech Hub',
            'start_datetime': now + timedelta(days=14),
            'end_datetime': now + timedelta(days=21),
            'registration_deadline': now + timedelta(days=10),
            'max_participants': 30,
            'status': 'upcoming',
            'is_featured': False
        }
    ]
    
    # Get admin user ID
    cursor.execute("SELECT id FROM users WHERE email = 'admin@eventnow.com'")
    admin_id = cursor.fetchone()[0]
    
    for event in sample_events:
        # Check if event already exists
        cursor.execute("SELECT id FROM events WHERE title = %s", (event['title'],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO events (
                title, description, category, location, start_datetime, end_datetime,
                registration_deadline, max_participants, status, is_featured,
                created_at, updated_at, organizer_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """, (
                event['title'],
                event['description'],
                event['category'],
                event['location'],
                event['start_datetime'],
                event['end_datetime'],
                event['registration_deadline'],
                event['max_participants'],
                event['status'],
                event['is_featured'],
                now,
                now,
                admin_id
            ))
            event_id = cursor.fetchone()[0]
            print(f"Added event: {event['title']} (ID: {event_id})")
        else:
            print(f"Event '{event['title']}' already exists")
    
    # Commit changes
    conn.commit()
    print("\nSample data added successfully!")
    
    # Close connection
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"\nError: {str(e)}")
