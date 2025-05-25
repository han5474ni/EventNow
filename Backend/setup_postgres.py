import os
import sys
import logging
import getpass
from dotenv import load_dotenv, set_key

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load current environment variables
load_dotenv()
env_file = os.path.join(os.path.dirname(__file__), '.env')

def update_env_file(key, value):
    """Update a key in the .env file"""
    set_key(env_file, key, value)
    logger.info(f"Updated {key} in .env file")

def setup_postgres_connection():
    print("\n===== PostgreSQL Connection Setup =====\n")
    print("This script will help you configure your PostgreSQL connection settings.")
    print("The settings will be saved to your .env file.\n")
    
    # Get current values from .env file
    current_db_type = os.getenv('DATABASE_TYPE', 'sqlite')
    current_db_name = os.getenv('DATABASE_NAME', 'eventnow')
    current_db_user = os.getenv('DATABASE_USER', '')
    current_db_host = os.getenv('DATABASE_HOST', 'localhost')
    current_db_port = os.getenv('DATABASE_PORT', '5432')
    
    print(f"Current settings:")
    print(f"  Database Type: {current_db_type}")
    print(f"  Database Name: {current_db_name}")
    print(f"  Database User: {current_db_user}")
    print(f"  Database Host: {current_db_host}")
    print(f"  Database Port: {current_db_port}\n")
    
    # Prompt for new values
    print("Enter new PostgreSQL connection details (press Enter to keep current value):")
    
    # Database type
    db_type = input(f"Database Type [postgresql]: ") or "postgresql"
    update_env_file('DATABASE_TYPE', db_type)
    
    # Database name
    db_name = input(f"Database Name [{current_db_name}]: ") or current_db_name
    update_env_file('DATABASE_NAME', db_name)
    
    # Database user
    db_user = input(f"Database User [postgres]: ") or "postgres"
    update_env_file('DATABASE_USER', db_user)
    
    # Database password
    db_pass = getpass.getpass(f"Database Password: ")
    if db_pass:
        update_env_file('DATABASE_PASSWORD', db_pass)
    
    # Database host
    db_host = input(f"Database Host [{current_db_host}]: ") or current_db_host
    update_env_file('DATABASE_HOST', db_host)
    
    # Database port
    db_port = input(f"Database Port [{current_db_port}]: ") or current_db_port
    update_env_file('DATABASE_PORT', db_port)
    
    print("\nPostgreSQL connection settings have been updated in your .env file.")
    print("\nTo test the connection, run: python test_postgres_connection.py")

if __name__ == "__main__":
    setup_postgres_connection()
