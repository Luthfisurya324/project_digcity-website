# 051 – Perbaikan Preview Admin Linktree (Real‑Time & Identik)

Tujuan: membuat panel preview di halaman Admin Linktree menampilkan tampilan yang 100% identik dengan halaman Linktree publik, serta memperbarui secara real‑time ketika admin melakukan perubahan.

## Fitur Utama

- Preview menggunakan komponen yang sama dengan halaman Linktree (`LinktreeLayout`, `LinktreeButton`, `LinktreeCard`).
- Real‑time update untuk profil, link, social, dan contact — termasuk perubahan yang belum disimpan dan item draft dari dialog “Add”.
- Kontrol ukuran perangkat: `Mobile`, `Tablet`, `Desktop`.
- Komponen interaktif (tombol/link) berfungsi seperti di halaman publik: klik membuka tautan.
- Bingkai preview memiliki scroll vertikal (`h-[720px]`) agar konten panjang tetap nyaman dilihat.

## Cara Menggunakan di Admin

1. Masuk ke Admin → Linktree.
2. Ubah `Title`, `Subtitle`, atau `Avatar` — preview akan berubah langsung tanpa perlu menekan Save.
3. Edit link/social/contact via dialog:
   - Saat dialog `Edit` terbuka, perubahan yang Anda ketik langsung tercermin di preview.
   - Saat dialog `Add` terbuka dan field wajib terisi, item draft akan tampil di preview sebelum Anda menekan `Add`.
4. Gunakan tombol `Mobile`, `Tablet`, atau `Desktop` untuk melihat preview pada lebar perangkat yang berbeda.
5. Klik tombol/tautan di preview untuk memastikan interaksi bekerja (tautan eksternal akan dibuka di tab baru).

## Catatan Teknis

- Preview data dibentuk dari state admin dengan merge terhadap state `editing`/`draft`. Tidak menunggu commit ke database.
- Platform `address/website` pada contact di-preview sebagai `location` agar ikon konsisten.
- Layout preview menggunakan komponen Linktree yang sama sehingga warna, font, animasi, dan jarak identik dengan halaman produksi.

## Troubleshooting

- Jika tautan tidak membuka tab baru, pastikan field `is_external` pada link diatur benar.
- Jika ikon tidak muncul, cek nilai `icon` pada link (mis. `Globe`, `FileText`, `Calendar`, `Image`, `Newspaper`).
- Bila preview tampak terlalu tinggi, sesuaikan tinggi bingkai dengan Tailwind kelas `h-[720px]` di `AdminLinktree.tsx`.

## Dampak Perubahan File

- `src/components/admin/AdminLinktree.tsx`: refactor preview untuk menggunakan komponen Linktree, penambahan kontrol `Tablet`, dan logika merge edits/drafts.

Silakan jalankan aplikasi secara lokal untuk memverifikasi: `npm run dev` lalu buka halaman admin Linktree.

