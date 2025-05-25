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
    # Get database settings from environment variables
    db_name = os.getenv('DATABASE_NAME', 'event')
    db_user = os.getenv('DATABASE_USER', 'postgres')
    db_pass = os.getenv('DATABASE_PASSWORD', 'postgres')
    db_host = os.getenv('DATABASE_HOST', 'localhost')
    db_port = os.getenv('DATABASE_PORT', '5432')
    
    logger.info(f"Database settings from .env: name={db_name}, user={db_user}, host={db_host}, port={db_port}")
    
    try:
        # Connect to PostgreSQL
        logger.info(f"Connecting to PostgreSQL database: {db_name} on {db_host}:{db_port} as {db_user}")
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_pass,
            host=db_host,
            port=db_port
        )
        
        # Create a cursor
        cursor = conn.cursor()
        
        # Test connection with a simple query
        cursor.execute("SELECT 1")
        result = cursor.fetchone()[0]
        logger.info(f"Connection successful: {result == 1}")
        
        # Get table information
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        """)
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Tables in database: {tables}")
        
        # For each table, get column information
        for table in tables:
            cursor.execute(f"""
                SELECT column_name, data_type FROM information_schema.columns 
                WHERE table_name = '{table}' ORDER BY ordinal_position
            """)
            columns = [(row[0], row[1]) for row in cursor.fetchall()]
            logger.info(f"Columns in {table}: {columns}")
        
        # Close cursor and connection
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    if not success:
        sys.exit(1)
