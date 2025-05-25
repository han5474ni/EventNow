import os
import sys
import logging
import psycopg2
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def test_postgres_connection():
    # Get database settings from environment variables
    db_type = os.getenv('DATABASE_TYPE', 'sqlite')
    db_name = os.getenv('DATABASE_NAME', 'eventnow')
    db_user = os.getenv('DATABASE_USER', 'postgres')
    db_pass = os.getenv('DATABASE_PASSWORD', '')
    db_host = os.getenv('DATABASE_HOST', 'localhost')
    db_port = os.getenv('DATABASE_PORT', '5432')
    
    # Check if PostgreSQL is configured
    if db_type.lower() != 'postgresql':
        logger.error("Database type is not set to PostgreSQL in .env file")
        logger.info("Run 'python setup_postgres.py' to configure PostgreSQL")
        return False
    
    logger.info(f"Testing PostgreSQL connection to {db_name} on {db_host}:{db_port} as {db_user}")
    
    try:
        # Connect to PostgreSQL
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
        
        print("\nPostgreSQL connection successful!")
        print(f"Found {len(tables)} tables in database: {', '.join(tables)}")
        print("\nYour database is ready to use with EventNow.")
        print("To use this database, make sure DATABASE_TYPE=postgresql in your .env file.")
        
        return True
    except Exception as e:
        logger.error(f"PostgreSQL connection error: {str(e)}")
        print("\nFailed to connect to PostgreSQL database.")
        print(f"Error: {str(e)}")
        print("\nPlease check your PostgreSQL credentials and try again.")
        print("Run 'python setup_postgres.py' to reconfigure your PostgreSQL connection.")
        return False

if __name__ == "__main__":
    success = test_postgres_connection()
    if not success:
        sys.exit(1)
