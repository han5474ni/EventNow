"""
Database setup and initialization script.

This script helps with setting up the database, running migrations, and creating initial data.
"""
import os
import sys
import argparse
from dotenv import load_dotenv

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

def print_header():
    """Print a nice header for the setup script."""
    print("\n" + "=" * 60)
    print("EVENTNOW DATABASE SETUP".center(60))
    print("=" * 60 + "\n")

def setup_database(reset=False, skip_migrations=False):
    """Set up the database with migrations and initial data.
    
    Args:
        reset (bool): If True, drop all tables before creating new ones.
        skip_migrations (bool): If True, skip running migrations.
    """
    from sqlalchemy import inspect
    from database import engine, Base
    from init_db import init_db
    
    # Load environment variables
    load_dotenv()
    
    print("Setting up the database...")
    
    if reset:
        print("\n[!] WARNING: This will DROP ALL TABLES in the database!")
        confirm = input("Are you sure you want to continue? (y/N): ")
        if confirm.lower() != 'y':
            print("Operation cancelled.")
            return
            
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped.")
    
    if not skip_migrations:
        print("\nRunning database migrations...")
        try:
            from init_db import run_migrations
            if run_migrations():
                print("✅ Database migrations completed successfully!")
            else:
                print("❌ Failed to run migrations.")
                return
        except Exception as e:
            print(f"❌ Error running migrations: {e}")
            return
    
    print("\nCreating initial data...")
    try:
        from init_db import create_initial_data
        if create_initial_data():
            print("✅ Initial data created successfully!")
        else:
            print("⚠️  Some issues occurred while creating initial data.")
    except Exception as e:
        print(f"❌ Error creating initial data: {e}")
        return
    
    print("\n✅ Database setup completed successfully!")

def main():
    """Main function to handle command line arguments."""
    parser = argparse.ArgumentParser(description='Setup the EventNow database.')
    parser.add_argument('--reset', action='store_true', help='Reset the database by dropping all tables')
    parser.add_argument('--skip-migrations', action='store_true', help='Skip running migrations')
    
    args = parser.parse_args()
    
    print_header()
    setup_database(reset=args.reset, skip_migrations=args.skip_migrations)

if __name__ == "__main__":
    main()
