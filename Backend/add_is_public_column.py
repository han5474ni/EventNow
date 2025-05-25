import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

# Get database type from environment variable directly
database_type = os.getenv('DATABASE_TYPE', 'sqlite').lower()
print(f"Database type from environment: {database_type}")

# Membuat koneksi ke database berdasarkan tipe database
if database_type == 'postgresql':
    # Use PostgreSQL connection
    db_name = os.getenv('DATABASE_NAME', 'postgres')
    db_user = os.getenv('DATABASE_USER', 'postgres')
    db_pass = os.getenv('DATABASE_PASSWORD', '')
    db_host = os.getenv('DATABASE_HOST', 'localhost')
    db_port = os.getenv('DATABASE_PORT', '5432')
    
    print(f"PostgreSQL settings: name={db_name}, user={db_user}, host={db_host}, port={db_port}")
    
    # Build connection URL
    SQLALCHEMY_DATABASE_URL = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    
    # Create engine without SQLite-specific connect_args
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    print(f"Using PostgreSQL database: {db_name}")
else:
    # Use SQLite connection
    db_name = os.getenv('DATABASE_NAME', 'eventnow')
    SQLALCHEMY_DATABASE_URL = f"sqlite:///./{db_name}.db"
    
    # Create engine with SQLite-specific connect_args
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    
    print(f"Using SQLite database: {db_name}.db")

# Fungsi untuk menambahkan kolom is_public ke tabel events
def add_is_public_column():
    # Membuat koneksi ke database
    with engine.connect() as connection:
        try:
            if database_type == 'postgresql':
                # Cek apakah kolom is_public sudah ada di tabel events (PostgreSQL)
                result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='events' AND column_name='is_public'"))
                rows = result.fetchall()
                if len(rows) == 0:
                    # Jika kolom belum ada, tambahkan kolom is_public dengan nilai default True
                    print("Menambahkan kolom is_public ke tabel events...")
                    connection.execute(text("ALTER TABLE events ADD COLUMN is_public BOOLEAN DEFAULT TRUE"))
                    print("Kolom is_public berhasil ditambahkan!")
                else:
                    print("Kolom is_public sudah ada di tabel events.")
            else:
                # SQLite syntax berbeda
                try:
                    # Cek apakah kolom is_public sudah ada di tabel events (SQLite)
                    result = connection.execute(text("PRAGMA table_info(events)"))
                    columns = result.fetchall()
                    column_names = [column[1] for column in columns]  # Kolom kedua adalah nama kolom
                    
                    if 'is_public' not in column_names:
                        # Jika kolom belum ada, tambahkan kolom is_public dengan nilai default True
                        print("Menambahkan kolom is_public ke tabel events...")
                        connection.execute(text("ALTER TABLE events ADD COLUMN is_public BOOLEAN DEFAULT 1"))
                        print("Kolom is_public berhasil ditambahkan!")
                    else:
                        print("Kolom is_public sudah ada di tabel events.")
                except Exception as e:
                    print(f"Error checking SQLite schema: {e}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_is_public_column()
