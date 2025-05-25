# Event Management System

Sebuah aplikasi manajemen event modern yang dibangun menggunakan React untuk frontend dan FastAPI untuk backend. Sistem ini memungkinkan pengguna untuk membuat, mengelola, dan mendaftar ke berbagai event.

## Fitur Utama

- Autentikasi pengguna (login, register, reset password)
- Manajemen event (create, read, update, delete)
- Sistem pendaftaran event
- Sistem komentar
- Verifikasi email
- Sistem rekomendasi event
- Integrasi dengan Slack
- Manajemen profil pengguna
- Rating untuk event

## Teknologi yang Digunakan

### Frontend
- React.js
- Tailwind CSS
- Context API untuk state management
- Jest untuk testing

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- Alembic untuk migrasi database
- JWT untuk autentikasi
- PostgreSQL/SQLite database
- Email service integration

## Struktur Proyek

```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── context/    # React context
│   │   └── utils/      # Utility functions
│
├── Backend/            # FastAPI backend application
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   └── templates/      # Email templates
```

## Cara Instalasi

### Prerequisites
- Python 3.12+
- Node.js 14+
- PostgreSQL/SQLite

### Backend Setup
1. Masuk ke direktori Backend:
   ```bash
   cd Backend
   ```
2. Buat virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   .\venv\Scripts\activate   # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup database:
   ```bash
   python create_database.py
   ```
5. Jalankan aplikasi:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm start
   ```

## Konfigurasi

1. Backend (.env):
   ```
   DATABASE_URL=postgresql://user:password@localhost/dbname
   SECRET_KEY=your_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_password
   ```

2. Frontend (.env):
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```
## Kontak
handayani.122140166@student.itera.ac.id