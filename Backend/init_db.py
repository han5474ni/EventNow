import os
import sys
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migrations():
    # Get the directory containing this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the alembic.ini file
    alembic_ini_path = os.path.join(script_dir, 'alembic.ini')
    
    # Create Alembic config
    alembic_cfg = Config(alembic_ini_path)
    
    # Run migrations
    print("Running database migrations...")
    command.upgrade(alembic_cfg, 'head')
    print("Migrations completed successfully!")

if __name__ == "__main__":
    run_migrations()
