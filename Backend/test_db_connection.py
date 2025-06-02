import sys
import logging
import psycopg2
from urllib.parse import quote_plus
from sqlalchemy import create_engine, text

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'dbname': 'eventnow',
    'user': 'postgres',
    'password': 'yani12345',
    'host': 'localhost',
    'port': '5432'
}

def test_connection():
    try:
        # Test connection using psycopg2 (low-level)
        logger.info("Testing connection using psycopg2...")
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT version();")
        db_version = cur.fetchone()
        logger.info(f"PostgreSQL version: {db_version[0]}")
        cur.close()
        conn.close()
        
        # Test connection using SQLAlchemy
        logger.info("\nTesting connection using SQLAlchemy...")
        db_url = f"postgresql://{DB_CONFIG['user']}:{quote_plus(DB_CONFIG['password'])}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
        engine = create_engine(db_url)
        
        with engine.connect() as connection:
            # Test basic query
            result = connection.execute(text("SELECT 1"))
            logger.info(f"SQLAlchemy connection test: {result.scalar() == 1}")
            
            # List all tables
            tables = connection.execute(text(
                """SELECT table_name 
                   FROM information_schema.tables 
                   WHERE table_schema = 'public'"""
            ))
            table_list = [row[0] for row in tables]
            logger.info(f"\nTables in database: {table_list}")
            
            # Show row count for each table
            for table in table_list:
                try:
                    count = connection.execute(text(f"SELECT COUNT(*) FROM \"{table}\""))
                    logger.info(f"Table '{table}': {count.scalar()} rows")
                except Exception as e:
                    logger.warning(f"Could not count rows in {table}: {str(e)}")
        
        return True
        
    except Exception as e:
        logger.error(f"Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Starting PostgreSQL connection test...")
    success = test_connection()
    if success:
        logger.info("\n✅ Database connection test completed successfully!")
    else:
        logger.error("\n❌ Database connection test failed!")
        sys.exit(1)
