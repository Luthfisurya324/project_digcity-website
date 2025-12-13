# DigCity Mobile App - Redesign Proposal & Vision
## 🎯 Visi: "DigCity Super App"
Mengubah aplikasi mobile dari sekadar alat absensi menjadi **pusat ekosistem digital** anggota. Aplikasi ini bukan hanya dibuka saat scan QR, tapi menjadi *daily driver* untuk melihat berita, perkembangan organisasi, dan pencapaian pribadi.
## 🎨 Konsep UI/UX: "Vibrant Glassmorphism 2.0"
Kita akan mempertahankan *glassmorphism* tapi membuatnya lebih "matang" dan "premium", terinspirasi dari iOS dan Android modern.
-   **Warna**: Deep Blue/Purple background (Dark Mode native) dengan aksen Neon Gradient (Cyan/Magenta).
-   **Komponen**: Kartu transparan dengan *backdrop blur* yang halus.
-   **Tipografi**: Modern Sans-Serif (Inter/Outfit) dengan hierarki ukuran yang jelas.
-   **Animasi**: Keseluruhan aplikasi harus terasa "hidup" (Micro-interactions saat tekan tombol, loading skeletons, slide transitions).
---
## 🚀 Fitur Unggulan Baru & Perbaikan
### 1. **Beranda (Dashboard) yang Dinamis**
Daripada menu statis, dashboard akan berubah sesuai konteks:
-   **Pagi**: "Selamat Pagi, [Nama]. Jangan lupa check-in acara hari ini!"
-   **Hero Section (Carousel)**: Menampilkan **Berita Terbaru** (dari Web) atau **Agenda Penting**.
-   **Quick Stats**: Ringkasan mini KPI & Saldo Iuran langsung terlihat (tanpa klik menu).
### 2. **Integrasi Berita (News Feed) - [NEW]**
Sesuai request, kita akan membawa konten web ke mobile.
-   **Tab "Explore"**: Halaman khusus untuk membaca artikel/berita DigCity.
-   **Fitur**: Mode Baca (Reading Mode), Like/Share artikel, Bookmark.
-   **Sumber Data**: Menggunakan `newsAPI` yang sudah ada di web.
### 3. **Gamifikasi & "Level Anggota"**
Membuat organisasi lebih seru.
-   **XP System**: Absensi = XP, Selesai Tugas = XP.
-   **Badges**: "On Time Hero", "Project Master", "Contributor".
-   **Visualisasi**: Progress bar KPI yang animatif di halaman profil.
### 4. **Kartu Anggota Digital (E-ID Card) yang Keren**
Di halaman Profile, E-ID Card bisa di-*flip* (animasi balik) untuk melihat QR Code pribadi. Mirip kartu kredit di Apple Wallet.
### 5. **Scan QR "Bottom Sheet" (Sudah Diimplementasi)**
Mempertahankan fitur Scan QR yang muncul dari bawah agar cepat dan tidak mengganggu navigasi.
---
## 📱 Struktur Navigasi Baru
Kami mengusulkan **Curved Bottom Navigation Bar** dengan 5 menu:
1.  **🏠 Home**: Dashboard personal, shortcut menu, reminder.
2.  **📰 Explore**: Berita, Artikel, Pengumuman (Dari Web).
3.  **🟣 SCAN (FAB)**: Tombol besar di tengah untuk Absensi Cepat.
4.  **📊 Kinerja**: Gabungan KPI + Tugas + Leaderboard dalam satu hub.
5.  **👤 Profil**: E-ID Card, Settings, Riwayat Aktivitas.
---
## 🛠️ Rencana Implementasi (Roadmap)
### Tahap 1: Fondasi & UI Overhaul (Prioritas)
-   [x] Setup Onboarding & Basic Nav.
-   [ ] **Redesign Dashboard**: Implementasi layout baru dengan Carousel Berita.
-   [ ] **Integrasi News API**: Tarik data blog dari Supabase ke Dashboard.
-   [ ] **Polish UI**: Tambahkan animasi (Framer Motion / Reanimated) di semua tombol/kartu.
### Tahap 2: Fitur Baru
-   [ ] **Halaman Explore**: List berita & detail artikel.
-   [ ] **Gamification UI**: Tampilan Level/XP di Profil.
-   [ ] **E-ID Card Animation**: Fitur flip kartu.
### Tahap 3: Penyempurnaan
-   [ ] **Mood Tracker**: Pop-up harian "Bagaimana perasaanmu hari ini?" untuk monitoring kesehatan mental anggota.
-   [ ] **Offline Mode**: Cache berita agar bisa dibaca tanpa internet.
---
## 💡 Ide "Gila" Tambahan (Opsional)
-   **"Shake to Report"**: Goyangkan HP untuk lapor masalah/bug.
-   **Widget Halaman Depan**: Widget Android/iOS untuk jadwal acara.
---
**Apakah Anda setuju dengan visi ini?** Jika ya, saya akan mulai dengan **Tahap 1**: Merombak Dashboard dan Menambahkan Integrasi Berita.