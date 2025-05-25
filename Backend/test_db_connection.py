import sys
import logging
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_connection():
    try:
        # Properly escape the database name, username and password
        db_name = quote_plus(settings.DATABASE_NAME)
        db_user = quote_plus(settings.DATABASE_USER) if settings.DATABASE_USER else ""
        db_pass = quote_plus(settings.DATABASE_PASSWORD) if settings.DATABASE_PASSWORD else ""
        
        # Create connection string
        db_url = f"postgresql://{db_user}:{db_pass}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{db_name}"
        
        # Log connection details (without password)
        logger.info(f"Attempting to connect to: postgresql://{db_user}:***@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{db_name}")
        
        # Create engine
        engine = create_engine(db_url)
        
        # Test connection
        with engine.connect() as connection:
            # Execute a simple query
            result = connection.execute(text("SELECT 1"))
            logger.info(f"Connection successful: {result.scalar() == 1}")
            
            # Get table information
            tables_result = connection.execute(text(
                """SELECT table_name FROM information_schema.tables 
                   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"""
            ))
            tables = [row[0] for row in tables_result]
            logger.info(f"Tables in database: {tables}")
            
            # For each table, get column information
            for table in tables:
                columns_result = connection.execute(text(
                    f"""SELECT column_name, data_type FROM information_schema.columns 
                       WHERE table_name = '{table}' ORDER BY ordinal_position"""
                ))
                columns = [(row[0], row[1]) for row in columns_result]
                logger.info(f"Columns in {table}: {columns}")
        
        return True
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    if not success:
        sys.exit(1)
