<<<<<<< HEAD

# EventNow – Platform Manajemen dan Pendaftaran Acara ITERA

EventNow adalah platform web yang dirancang untuk membantu civitas akademika ITERA dalam mengelola dan mengakses informasi seputar event kampus seperti Studium Generale, seminar, dan kegiatan Himpunan maupun UKM. Aplikasi ini dilengkapi dengan fitur login Google, sistem CRUD event, dan tampilan antarmuka yang responsif.

---

## Deskripsi Aplikasi

EventNow bertujuan menjadi pusat informasi terintegrasi untuk semua kegiatan mahasiswa ITERA. Setiap pengguna yang login menggunakan akun Google dapat melihat daftar event, mengelola event sesuai kategorinya, serta melakukan pendaftaran secara digital. Platform ini dibangun menggunakan Python Pyramid untuk backend dan React JS untuk frontend, dengan komunikasi melalui RESTful API.

---

##  Teknologi & Dependensi

###  Backend
- [Python Pyramid](https://trypyramid.com/)
- PostgreSQL
- SQLAlchemy
- `google-auth` (untuk verifikasi token Google OAuth2)
- Pyramid RESTful API
- `pytest` (untuk unit testing ≥ 60% coverage)

###  Frontend
- [React JS](https://react.dev/)
- React Router DOM
- Context API
- Axios
- Tailwind CSS
- `@react-oauth/google` (untuk Google Login)

---

##  Fitur Aplikasi

- Login dengan akun Google (OAuth2)
- Daftar semua event yang sedang berlangsung
- Filter berdasarkan kategori (Himpunan, UKM, IKM, Umum)
- Tambah, edit, dan hapus event (CRUD)
- Detail event lengkap (poster, deskripsi, tanggal, lokasi)
- Dashboard untuk melihat event yang dibuat pengguna
- UI responsif dan mobile-friendly

---

## Struktur Folder
---

##  Endpoint API (Contoh)

| Endpoint              | Method | Fungsi                          |
|-----------------------|--------|----------------------------------|
| `/api/login`          | POST   | Login & verifikasi token Google |
| `/api/events`         | GET    | Daftar semua event              |
| `/api/events/:id`     | GET    | Detail satu event               |
| `/api/events`         | POST   | Tambah event                    |
| `/api/events/:id`     | PUT    | Edit event                      |
| `/api/events/:id`     | DELETE | Hapus event                     |

---

## 🛡️ Autentikasi

- Login menggunakan akun Google
- Token Google dikirim ke backend untuk divalidasi
- Setelah valid, server mengizinkan akses protected route

---

##  Referensi

---

##  Penulis

- Nama: **Handayani**
- NIM: **122140166**
- Kelas: **Pemrograman Web RB**

---

##  Link Repository

> Repositori aktif sejak minggu pertama  
>  [https://github.com/han5474ni/EventNow](https://github.com/han5474ni/EventNow)
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> master
