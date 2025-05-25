# Script untuk memperbaiki database dengan SQL langsung
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

def fix_database():
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
        
        # Backup events table
        logger.info("Membuat backup tabel events...")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS events_backup AS 
        SELECT * FROM events;
        """)
        
        # Recreate events table with string columns instead of enums
        logger.info("Membuat tabel events baru dengan kolom string...")
        
        # Dapatkan semua kolom kecuali category dan status
        cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name NOT IN ('category', 'status');
        """)
        columns = cursor.fetchall()
        
        # Buat SQL untuk membuat tabel baru
        create_table_sql = "CREATE TABLE events_new (\n"
        for col_name, col_type in columns:
            create_table_sql += f"    {col_name} {col_type},\n"
        
        # Tambahkan kolom category dan status sebagai string
        create_table_sql += "    category VARCHAR(50) NOT NULL,\n"
        create_table_sql += "    status VARCHAR(50) DEFAULT 'upcoming'\n"
        create_table_sql += ");\n"
        
        # Eksekusi SQL untuk membuat tabel baru
        cursor.execute(create_table_sql)
        
        # Copy data dari tabel lama ke tabel baru
        logger.info("Menyalin data dari tabel lama ke tabel baru...")
        
        # Dapatkan semua nama kolom
        cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'events';
        """)
        all_columns = [col[0] for col in cursor.fetchall()]
        columns_str = ", ".join(all_columns)
        
        # Copy data
        cursor.execute(f"""
        INSERT INTO events_new 
        SELECT {columns_str} 
        FROM events;
        """)
        
        # Drop tabel lama
        logger.info("Menghapus tabel lama...")
        cursor.execute("DROP TABLE events;")
        
        # Rename tabel baru
        logger.info("Mengubah nama tabel baru...")
        cursor.execute("ALTER TABLE events_new RENAME TO events;")
        
        # Recreate indexes and constraints
        logger.info("Membuat ulang indeks dan constraint...")
        cursor.execute("""
        ALTER TABLE events ADD PRIMARY KEY (id);
        CREATE INDEX IF NOT EXISTS ix_events_id ON events (id);
        """)
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("Database berhasil diperbaiki!")
        return True
    except Exception as e:
        logger.error(f"Error saat memperbaiki database: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Memulai perbaikan database...")
    success = fix_database()
    if success:
        logger.info("Perbaikan database berhasil!")
    else:
        logger.error("Perbaikan database gagal!")
