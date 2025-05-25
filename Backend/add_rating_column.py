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

# Add rating column to comments table if it doesn't exist
with engine.connect() as conn:
    # Check if rating column exists
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name = 'comments' AND column_name = 'rating'"
    ))
    column_exists = result.fetchone() is not None
    
    if not column_exists:
        print("Adding rating column to comments table...")
        conn.execute(text("ALTER TABLE comments ADD COLUMN rating INTEGER"))
        conn.commit()
        print("Rating column added successfully!")
    else:
        print("Rating column already exists in comments table.")
