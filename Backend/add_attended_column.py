import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database connection details from environment variables
db_type = os.getenv("DATABASE_TYPE", "postgresql")
db_name = os.getenv("DATABASE_NAME", "eventnow")
db_user = os.getenv("DATABASE_USER", "postgres")
db_password = os.getenv("DATABASE_PASSWORD", "")
db_host = os.getenv("DATABASE_HOST", "localhost")
db_port = os.getenv("DATABASE_PORT", "5432")

# Create database URL
db_url = f"{db_type}://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

print(f"Database URL: {db_url}")

# Create engine
engine = create_engine(db_url)

# Add attended column to registrations table if it doesn't exist
with engine.connect() as conn:
    # Check if attended column exists
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name = 'registrations' AND column_name = 'attended'"
    ))
    column_exists = result.fetchone() is not None
    
    if not column_exists:
        print("Adding attended column to registrations table...")
        conn.execute(text("ALTER TABLE registrations ADD COLUMN attended BOOLEAN DEFAULT FALSE"))
        conn.commit()
        print("attended column added successfully!")
    else:
        print("attended column already exists in registrations table.")
