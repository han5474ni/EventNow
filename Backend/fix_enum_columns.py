# Script untuk memperbaiki kolom enum di database
import psycopg2
import os
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database connection details
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', 'yani12345')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

def fix_enum_columns():
    try:
        # Connect to PostgreSQL database
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_pass,
            host=db_host,
            port=db_port
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # 1. Tambahkan kolom category_str
        try:
            logger.info("Menambahkan kolom category_str...")
            cursor.execute("ALTER TABLE events ADD COLUMN category_str VARCHAR(50);")
        except psycopg2.errors.DuplicateColumn:
            logger.info("Kolom category_str sudah ada.")
        
        # 2. Isi kolom category_str dengan nilai dari category
        logger.info("Mengisi kolom category_str...")
        cursor.execute("UPDATE events SET category_str = category::text;")
        
        # 3. Tambahkan kolom status_str
        try:
            logger.info("Menambahkan kolom status_str...")
            cursor.execute("ALTER TABLE events ADD COLUMN status_str VARCHAR(50);")
        except psycopg2.errors.DuplicateColumn:
            logger.info("Kolom status_str sudah ada.")
        
        # 4. Isi kolom status_str dengan nilai dari status
        logger.info("Mengisi kolom status_str...")
        cursor.execute("UPDATE events SET status_str = status::text;")
        
        # 5. Hapus kolom category
        logger.info("Menghapus kolom category...")
        cursor.execute("ALTER TABLE events DROP COLUMN category;")
        
        # 6. Hapus kolom status
        logger.info("Menghapus kolom status...")
        cursor.execute("ALTER TABLE events DROP COLUMN status;")
        
        # 7. Rename kolom category_str menjadi category
        logger.info("Mengubah nama kolom category_str menjadi category...")
        cursor.execute("ALTER TABLE events RENAME COLUMN category_str TO category;")
        
        # 8. Rename kolom status_str menjadi status
        logger.info("Mengubah nama kolom status_str menjadi status...")
        cursor.execute("ALTER TABLE events RENAME COLUMN status_str TO status;")
        
        # 9. Tambahkan constraint NOT NULL ke kolom category
        logger.info("Menambahkan constraint NOT NULL ke kolom category...")
        cursor.execute("ALTER TABLE events ALTER COLUMN category SET NOT NULL;")
        
        # 10. Tambahkan default value ke kolom status
        logger.info("Menambahkan default value ke kolom status...")
        cursor.execute("ALTER TABLE events ALTER COLUMN status SET DEFAULT 'upcoming';")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("Kolom enum berhasil diperbaiki!")
        return True
    except Exception as e:
        logger.error(f"Error saat memperbaiki kolom enum: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Memulai perbaikan kolom enum...")
    success = fix_enum_columns()
    if success:
        logger.info("Perbaikan kolom enum berhasil!")
    else:
        logger.error("Perbaikan kolom enum gagal!")
