<div align="center">
  <h1>🎉 EventNow: Platform Manajemen Event Kampus</h1>
  <p>Platform terdepan untuk menemukan, mengelola, dan berpartisipasi dalam berbagai acara kampus</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
  
  ![EventNow Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=EventNow+Platform+Manajemen+Event+Kampus)
</div>

## 📋 Daftar Isi
- [✨ Fitur Unggulan](#-fitur-unggulan)
- [🚀 Teknologi](#-teknologi)
- [🛠️ Instalasi](#%EF%B8%8F-instalasi)
- [📚 Dokumentasi API](#-dokumentasi-api)
- [🧪 Testing](#-testing)
- [🤝 Berkontribusi](#-berkontribusi)
- [📄 Lisensi](#-lisensi)
- [📞 Kontak](#-kontak)

## ✨ Fitur Unggulan

### 🎯 Untuk Peserta
- 🔍 Temukan event kampus dengan mudah
- 📅 Lihat jadwal dan detail event secara lengkap
- 🎟️ Daftar event dengan sekali klik
- 🔔 Dapatkan notifikasi event terbaru
- ⭐ Beri rating dan ulasan untuk event yang diikuti
- 📱 Antarmuka mobile-friendly

### 🛠️ Untuk Panitia/Admin
- ✨ Buat dan kelola event dengan mudah
- 📊 Pantau statistik pendaftar secara real-time
- 📈 Analisis partisipasi event
- 👥 Kelola pendaftaran peserta
- ✉️ Kirim notifikasi ke peserta
- 📑 Ekspor data peserta

### 🔒 Keamanan & Manajemen
- 🔐 Autentikasi berbasis JWT
- ✉️ Verifikasi email
- 🔄 Reset password yang aman
- 👥 Manajemen peran pengguna (Admin, Panitia, Peserta)
- 📱 Responsive design
- ⚡ Optimasi performa tinggi

## 🚀 Teknologi

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.8+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Autentikasi**: JWT (JSON Web Tokens)
- **Validasi Data**: Pydantic
- **Dokumentasi API**: Swagger UI & ReDoc
- **Testing**: Pytest
- **Lainnya**: Alembic (migrasi database), Uvicorn (ASGI server)

### Frontend
- **Framework**: [React.js](https://reactjs.org/)
- **State Management**: Redux Toolkit
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Form Handling**: Formik & Yup
- **Testing**: Jest & React Testing Library
- **Lainnya**: Axios (HTTP client), React Router (routing)

## 🛠️ Instalasi

### Prasyarat
- Python 3.8+
- Node.js 16+
- PostgreSQL 13+
- pip (Python package manager)
- npm / yarn

### Backend Setup

1. Clone repositori:
   ```bash
   git clone https://github.com/username/EventNow.git
   cd EventNow/Backend
   ```

2. Buat dan aktifkan virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Buat file `.env` di direktori Backend dan isi dengan konfigurasi:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/eventnow
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

5. Jalankan migrasi database:
   ```bash
   alembic upgrade head
   ```

6. Jalankan server pengembangan:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Masuk ke direktori frontend:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Buat file `.env` dan atur variabel environment:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Jalankan server pengembangan:
   ```bash
   npm start
   # atau
   yarn start
   ```

## 📚 Dokumentasi API

Dokumentasi API interaktif tersedia di:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

Endpoint utama API:
- `POST /api/auth/register` - Pendaftaran pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/events` - Daftar event
- `POST /api/events` - Buat event baru (admin/organizer)
- `GET /api/events/{event_id}` - Detail event

## 🧪 Testing

### Backend Testing
```bash
cd Backend
# Install dependencies testing
pip install -r requirements-test.txt

# Jalankan semua test
pytest --cov=./ --cov-report=term-missing

# Hasilkan laporan coverage HTML
pytest --cov=./ --cov-report=html
```

### Frontend Testing
```bash
cd frontend

# Jalankan semua test
npm test
# atau
yarn test

# Jalankan test dengan coverage
npm test -- --coverage
# atau
yarn test --coverage
```

## 🤝 Berkontribusi

Kami sangat menghargai kontribusi dari komunitas! Berikut cara berkontribusi:

1. Fork repositori ini
2. Buat branch untuk fitur baru (`git checkout -b fitur/namafitur`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/namafitur`)
5. Buat Pull Request

### Panduan Kontribusi
- Ikuti standar koding yang ada
- Pastikan semua test berjalan dengan sukses
- Update dokumentasi sesuai kebutuhan
- Buat issue terlebih dahulu sebelum mengerjakan fitur besar

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 📞 Kontak

- **Email**: support@eventnow.app
- **Twitter**: [@EventNowID](https://twitter.com/EventNowID)
- **Website**: [https://eventnow.app](https://eventnow.app)

## 🙏 Ucapan Terima Kasih

- Terima kasih kepada semua kontributor yang telah membantu pengembangan proyek ini
- Ikon oleh [React Icons](https://react-icons.github.io/react-icons/)
- Dibangun dengan ❤️ untuk komunitas kampus Indonesia

---

<div align="center">
  <p>© 2025 EventNow - All Rights Reserved</p>
  <p>Dibuat dengan 💙 oleh Tim EventNow</p>
</div>
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
