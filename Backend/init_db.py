import os
import sys
import logging
from datetime import datetime, timedelta
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

# Import models and database
from models import *
from database import engine, Base, SessionLocal
from models.user import User, UserRole
from models.event import Event, EventCategory, EventStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migrations():
    """Run database migrations using Alembic."""
    try:
        # Get the directory containing this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Path to the alembic.ini file
        alembic_ini_path = os.path.join(script_dir, 'alembic.ini')
        
        # Create Alembic config
        alembic_cfg = Config(alembic_ini_path)
        
        # Run migrations
        logger.info("Running database migrations...")
        command.upgrade(alembic_cfg, 'head')
        logger.info("Migrations completed successfully!")
        return True
    except Exception as e:
        logger.error(f"Error running migrations: {e}")
        return False

def create_initial_data():
    """Create initial data in the database."""
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin = db.query(User).filter(User.email == "admin@eventnow.com").first()
        if not admin:
            # Create admin user
            admin = User(
                email="admin@eventnow.com",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # 'admin123' hashed
                full_name="Admin User",
                role=UserRole.ADMIN,
                is_active=True,
                email_verified=True
            )
            db.add(admin)
            db.commit()
            logger.info("Created admin user")
        
        # Create sample events if none exist
        if db.query(Event).count() == 0:
            sample_events = [
                {
                    "title": "Tech Conference 2023",
                    "description": "Annual technology conference featuring the latest in software development.",
                    "category": EventCategory.SEMINAR.value,
                    "location": "Convention Center, Jakarta",
                    "start_datetime": datetime.utcnow() + timedelta(days=30),
                    "end_datetime": datetime.utcnow() + timedelta(days=31),
                    "max_participants": 200,
                    "organizer_id": admin.id,
                    "is_featured": True
                },
                {
                    "title": "Coding Bootcamp",
                    "description": "Intensive coding bootcamp for beginners.",
                    "category": EventCategory.WORKSHOP.value,
                    "location": "Online",
                    "start_datetime": datetime.utcnow() + timedelta(days=15),
                    "end_datetime": datetime.utcnow() + timedelta(days=22),
                    "max_participants": 50,
                    "organizer_id": admin.id
                }
            ]
            
            for event_data in sample_events:
                event = Event(**event_data)
                db.add(event)
            
            db.commit()
            logger.info("Created sample events")
        
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating initial data: {e}")
        return False
    finally:
        db.close()

def init_db():
    """Initialize the database with migrations and sample data."""
    # Load environment variables
    load_dotenv()
    
    # Run migrations
    if not run_migrations():
        logger.error("Failed to run migrations. Exiting...")
        sys.exit(1)
    
    # Create initial data
    if not create_initial_data():
        logger.warning("Failed to create initial data. Continuing anyway...")
    
    logger.info("Database initialization completed successfully!")

if __name__ == "__main__":
    init_db()
