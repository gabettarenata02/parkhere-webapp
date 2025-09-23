# Panduan Kontribusi & Konteks AI untuk ParkHere

**Versi: 1.1**
**Terakhir Diperbarui: 23 September 2025**

Selamat datang di tim ParkHere! Dokumen ini adalah panduan esensial untuk semua developer yang berkontribusi pada proyek ini, terutama saat menggunakan alat bantu AI seperti Cursor. Tujuannya adalah untuk menjaga konsistensi, kualitas kode, dan pemahaman bersama tentang arsitektur aplikasi kita.

**Membaca dokumen ini adalah WAJIB sebelum menulis baris kode pertama.**

---

## 1. Deskripsi Proyek & Studi Kasus

**ParkHere** adalah aplikasi web progresif (PWA) yang dirancang untuk mengatasi masalah parkir di area perkotaan. 

**Studi Kasus MVP (Minimum Viable Product):** Untuk demo kompetisi, kita fokus pada implementasi **Sistem Parkir Cerdas di area kampus UPN "Veteran" Jakarta.** Aplikasi akan menampilkan beberapa lokasi parkir di dalam kampus (misal: Parkir APU, Parkir Wahidin) dan menunjukkan ketersediaan slot secara *real-time* berdasarkan jenis kendaraan.

---

## 2. Struktur Proyek & File

Berikut adalah penjelasan untuk setiap file dan folder utama dalam proyek ini:

### `index.html`
- **Tujuan:** Halaman *landing* utama. Memeriksa status login pengguna dan mengarahkan ke `home.html` (jika sudah login) atau `login.html` (jika belum).
- **Logika Terkait:** `js/main.js`

### Halaman Autentikasi
- `login.html`: Halaman untuk pengguna masuk.
- `register.html`: Halaman untuk pengguna baru mendaftar.
- **Logika Terkait:** `js/auth.js`, `js/main.js`, `js/ui.js`

### Halaman Manajemen Kendaraan
- `add-vehicle.html`: Form untuk menambah data kendaraan baru.
- `vehicle-list.html`: Halaman untuk melihat, memilih kendaraan aktif, dan mengelola daftar kendaraan.
- **Logika Terkait:** `js/firestore.js`, `js/main.js`, `js/ui.js`

### Halaman Inti Aplikasi
- `home.html`: Dashboard utama setelah login. Menampilkan daftar spot parkir di UPNVJ dengan filter kategori (Mobil/Motor).
- `detail-parkir.html`: **(NEXT TASK)** Akan menampilkan informasi detail satu lokasi parkir.
- `tiket.html`: (Belum dibuat) Akan menampilkan tiket parkir aktif.
- `profile.html`: (Belum dibuat) Halaman profil pengguna dan pengaturan.

### Folder Aset & Styling
- `css/style.css`: Berisi semua *custom styling*. Semua style harus konsisten dengan *style guide*.
- `js/`: Folder utama untuk semua logika JavaScript.
  - `auth.js`: Mengelola semua interaksi dengan **Firebase Authentication** (register, login, logout, `getCurrentUser`). **Satu-satunya tempat untuk logika autentikasi.**
  - `firestore.js`: Mengelola semua interaksi dengan **Cloud Firestore** (menambah/mengambil data kendaraan, lokasi parkir, dll.). **Satu-satunya tempat untuk query database.**
  - `ui.js`: Berisi fungsi-fungsi pembantu untuk interaksi UI (`showToast`, `showPopup`, `parseFirebaseError`). **Semua notifikasi harus menggunakan fungsi dari sini.**
  - `main.js`: "Orkestrator" utama. Berisi *event listeners* untuk semua halaman, logika untuk merender data ke HTML, dan mengelola *state* aplikasi (seperti `selectedCategory`).
- `assets/`: Untuk menyimpan gambar dan file statis lainnya.

---

## 3. Panduan Teknis & Style Guide

Semua kode yang ditulis **HARUS** mengikuti panduan ini. Gunakan ini sebagai konteks saat memberikan prompt ke AI.

- **Framework:** HTML5, CSS3, JavaScript (ES Modules `import`/`export`).
- **Styling:**
  - **Layout:** Bootstrap 5 (Grid System, Flexbox, Spacing Utilities).
  - **Komponen Kustom:** Ditulis di `css/style.css`.
- **Development Server:** Gunakan ekstensi **Live Server** di Cursor/VS Code.
- **Tema Desain (Dark Mode):**
  - **Background Utama:** `#1E1E1E`
  - **Background Komponen (Kartu, Input):** `#2C2C2C`
  - **Warna Aksen Utama (Tombol Primer, Highlight):** `#F2C84F`
  - **Warna Teks Utama:** `#FFFFFF`
  - **Warna Teks Sekunder/Placeholder:** `#8E8E93`
- **Tipografi:**
  - **Font Utama:** Public Sans (diimpor dari Google Fonts).
- **Ikon:**
  - **Library:** Phosphor Icons (diimpor via CDN).
- **Backend & Database:**
  - **Layanan:** Firebase.
  - **Autentikasi:** Firebase Authentication (Email/Password & Google).
  - **Database:** Cloud Firestore.
    - **Koleksi Penting:** `users`, `vehicles`, `parkingLocations`.
- **UI Feedback:**
  - **Library:** SweetAlert2 (diimpor via CDN).
  - **Metode:** Gunakan fungsi `showToast()` dan `showPopup()` dari `js/ui.js`. **Jangan gunakan `alert()` bawaan browser.**

---

## 4. Kumpulan Prompt Kunci (AI Prompt Library)

Untuk menjaga konsistensi, gunakan prompt-prompt di bawah ini sebagai dasar. Selalu berikan konteks file yang relevan menggunakan fitur `@`.

**Contoh Memberi Konteks:**
> _"Using the context from `@CONTRIBUTING_AI.md`, `@css/style.css`, and `@home.html`, please create the HTML for a new page `detail-parkir.html`..."_

### **Prompt untuk Membuat Halaman/Komponen UI Baru:**
> _"Generate the HTML and CSS for a new page/component for the ParkHere app. It **MUST** be stylistically consistent with our project's established style guide: Dark theme (background `#1E1E1E`, component bg `#2C2C2C`, accent `#F2C84F`), fully responsive using Bootstrap 5 grid, Public Sans for text, and Phosphor Icons. The layout should be centered and scale from mobile to desktop (`col-12 col-md-10 col-lg-8`)."_

### **Prompt untuk Menambahkan Fungsionalitas Firestore:**
> _"In `@js/firestore.js`, create a new async function to [jelaskan tujuan fungsi, misal: 'fetch a single parking location by its ID']. It must use Firestore version 9 modular syntax, be wrapped in a `try/catch` block, and be exported. It needs to interact with the '[nama_koleksi]' collection."_

### **Prompt untuk Logika Halaman di `main.js`:**
> _"In `@js/main.js`, inside the `DOMContentLoaded` listener, add the logic for the `[nama_halaman].html` page. Create a new function `initialize[NamaHalaman]Page()`. This function should first get the current user with `getCurrentUser()`. Then, it should call the necessary functions from `@js/firestore.js` to fetch data. Finally, it should dynamically render the data into the correct HTML elements, handling loading and empty states. Add event listeners for any interactive elements on the page."_

### **Prompt untuk Filter Kategori (Sudah Diimplementasikan):**
> _"Implement category filtering on the home page. In `firestore.js`, modify `getParkingLocations(category)` to filter documents where the `availableFor` array contains the category. In `main.js`, create a `selectedCategory` state variable and event listeners for the filter buttons. When a button is clicked, update the state and call a `displayParkingSpots()` function to re-fetch and re-render the list."_

---

Dengan mengikuti panduan ini, kita dapat memastikan bahwa setiap kontribusi, baik dari manusia maupun AI, akan selaras dengan visi dan kualitas proyek ParkHere.