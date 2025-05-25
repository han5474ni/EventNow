import psycopg2
from config import settings

# Koneksi ke database
conn = psycopg2.connect(
    dbname=settings.DATABASE_NAME,
    user=settings.DATABASE_USER,
    password=settings.DATABASE_PASSWORD,
    host=settings.DATABASE_HOST,
    port=settings.DATABASE_PORT
)

# Buat cursor
cursor = conn.cursor()

# Tambahkan kolom image_url jika belum ada
try:
    cursor.execute("""
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
    """)
    conn.commit()
    print("Kolom image_url berhasil ditambahkan ke tabel events")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()
