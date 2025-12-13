# Panduan Replikasi Sistem Internal DIGCITY

Panduan ini akan membantu Anda menduplikasi seluruh sistem internal website ini (Frontend + Backend + Database) untuk digunakan di organisasi atau proyek lain dengan fitur yang sama.

## 1. Persiapan Backend (Supabase)

Sistem ini menggunakan Supabase sebagai backend (Database, Auth, Storage).

1.  **Buat Project Baru**: Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru ("New Project").
2.  **Buka SQL Editor**: Di dashboard project baru Anda, masuk ke menu "SQL Editor".
3.  **Jalankan Schema**: 
    *   Copy seluruh isi file `complete_schema.sql` yang ada di folder ini (`replicate_system/complete_schema.sql`).
    *   Paste ke SQL Editor Supabase.
    *   Klik tombol "Run".
    *   Ini akan membuat semua tabel, enum, dan setting keamanan (RLS) yang dibutuhkan.
4.  **Matikan Konfirmasi Email (Opsional)**:
    *   Masuk ke menu **Authentication** -> **Providers** -> **Email**.
    *   Disable "Confirm email" jika Anda ingin user bisa langsung login/signup tanpa verifikasi email (untuk kemudahan testing awal).
5.  **Setup Environment Variables**:
    *   Masuk ke **Settings** -> **API**.
    *   Copy `Project URL` dan `anon` / `public` API Key.

## 2. Persiapan Project Code (Frontend)

Anda bisa menyalin folder project ini, atau clone dari repository jika ada.

1.  **Duplicate Folder**: Copy seluruh folder project `project_digcity-website` ke folder baru, misal `project_organisasi_baru`.
2.  **Update Environment**:
    *   Di folder project baru, cari file `.env` (atau buat jika belum ada, contohnya dari `.env.example`).
    *   Ganti nilai berikut dengan data dari Supabase Project baru Anda (Langkah 1.5):
        ```env
        VITE_SUPABASE_URL=https://your-new-project-url.supabase.co
        VITE_SUPABASE_ANON_KEY=your-new-anon-key
        ```
3.  **Install Dependencies**:
    *   Buka terminal di folder project baru.
    *   Jalankan `npm install` untuk menginstall semua library.

## 3. (Opsional) Ambil Bagian Internal Saja

Jika Anda **hanya** menginginkan sistem internal (Dashboard Keuangan, Anggota, Absensi, dll) dan **tidak** membutuhkan website publik (Landing page, Blog, dll):

1.  **Jalankan Script Pembersih**:
    *   Di terminal folder project baru Anda, jalankan script PowerShell berikut:
        ```powershell
        ./replicate_system/cleanup_internal_only.ps1
        ```
    *   Script ini akan otomatis menghapus halaman publik dan mengatur ulang routing agar langsung masuk ke Internal Panel.

## 4. Penyesuaian Data Awal (Seeding)

Setelah sistem siap, Anda perlu membuat user admin atau data anggota awal.

1.  **Buat Akun**:
    *   Jalankan aplikasi dengan `npm run dev`.
    *   Buka halaman Login dan lakukan Sign Up.
2.  **Jadikan Admin/Member Internal**:
    *   Secara default, user baru statusnya "viewer" atau "public".
    *   Buka **Table Editor** di Supabase -> tabel `organization_members`.
    *   Buat row baru untuk user Anda. Pastikan email sama dengan email login.
    *   Isi `position` dengan "Ketua" atau "BPH" agar Anda mendapatkan akses penuh di Internal Panel.
    *   Isi `division` sesuai kebutuhan (misal "BPH").
    *   Update Metadata User (Opsional tapi disarankan agar role terbaca cepat):
        *   Di Supabase SQL Editor, jalankan:
            ```sql
            UPDATE auth.users 
            SET raw_user_meta_data = '{"internal_role": "bph", "position": "Ketua", "division": "BPH"}'
            WHERE email = 'email_anda@example.com';
            ```

## 4. Customisasi Tambahan

*   **Nama Organisasi**: Cari dan ganti teks "DIGCITY" dengan nama organisasi Anda di file `src/App.tsx`, `index.html`, dan komponen Navbar/Header.
*   **Logo**: Ganti file logo di folder `public/`.
*   **Struktur Divisi**: Jika divisi organisasi baru berbeda, Anda mungkin perlu mengubah hardcoded value di form dropdown (misal di `MembersPage.tsx` atau `EventForm.tsx`).

## 5. Deployment

Jika ingin mengonlinekan sistem baru:
1.  Push code ke GitHub repository baru.
2.  Connect repository ke Vercel atau Netlify.
3.  Masukkan Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) di setting deployment platform tersebut.
