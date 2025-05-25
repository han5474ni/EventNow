import os
import sys
from alembic.config import Config
from alembic import command

# Get the absolute path to this directory
dir_path = os.path.dirname(os.path.abspath(__file__))

def run_migrations():
    # Path to the alembic.ini file
    alembic_ini_path = os.path.join(dir_path, 'alembic.ini')
    
    # Path to the alembic directory
    alembic_dir = os.path.join(dir_path, 'alembic')
    
    # Create Alembic config
    config = Config(alembic_ini_path)
    
    # Add the current directory to the Python path
    # This is needed for the imports in env.py to work
    sys.path.insert(0, dir_path)
    
    # Run the migrations
command.upgrade(config, 'head')

if __name__ == '__main__':
    run_migrations()
