# Script untuk mengubah tipe kolom category dari Enum menjadi String
import os
import sys
import logging
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database connection details
database_type = os.getenv('DATABASE_TYPE', 'sqlite').lower()
db_name = os.getenv('DATABASE_NAME', 'eventnow')
db_user = os.getenv('DATABASE_USER', 'postgres')
db_pass = os.getenv('DATABASE_PASSWORD', '')
db_host = os.getenv('DATABASE_HOST', 'localhost')
db_port = os.getenv('DATABASE_PORT', '5432')

# Create database connection
if database_type == 'postgresql':
    connection_string = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
else:
    connection_string = f"sqlite:///./{db_name}.db"

engine = create_engine(connection_string)

def convert_category_to_string():
    """Convert the category column from enum to string"""
    try:
        with engine.connect() as connection:
            # Untuk PostgreSQL, kita perlu menggunakan pendekatan yang berbeda
            if database_type == 'postgresql':
                # 1. Buat kolom baru sebagai string
                connection.execute(text("ALTER TABLE events ADD COLUMN category_str VARCHAR(50)"))
                connection.commit()
                
                # 2. Salin nilai dari kolom enum ke kolom string
                connection.execute(text("UPDATE events SET category_str = category::text"))
                connection.commit()
                
                # 3. Hapus kolom enum lama
                connection.execute(text("ALTER TABLE events DROP COLUMN category"))
                connection.commit()
                
                # 4. Rename kolom baru ke nama asli
                connection.execute(text("ALTER TABLE events RENAME COLUMN category_str TO category"))
                connection.commit()
                
                # 5. Tambahkan constraint not null
                connection.execute(text("ALTER TABLE events ALTER COLUMN category SET NOT NULL"))
                connection.commit()
            else:
                # Untuk SQLite, kita perlu membuat tabel baru dan memindahkan data
                # SQLite tidak mendukung ALTER TABLE untuk mengubah tipe kolom
                logger.info("SQLite tidak mendukung ALTER TABLE untuk mengubah tipe kolom. Gunakan PostgreSQL.")
                return False
            
            logger.info("Berhasil mengubah kolom category dari enum menjadi string.")
            return True
    except Exception as e:
        logger.error(f"Error saat mengubah kolom category: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Memulai migrasi untuk mengubah kolom category dari enum menjadi string...")
    success = convert_category_to_string()
    if success:
        logger.info("Migrasi berhasil!")
    else:
        logger.error("Migrasi gagal!")
