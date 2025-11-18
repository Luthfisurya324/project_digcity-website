# LinkTree Admin Testing Checklist

## Scope
- CRUD fungsi untuk LinkTree: profil, links, social media, contact info
- Live preview sinkron dengan perubahan editor
- Responsiveness mobile/desktop di preview
- Autosave profil setiap 30 detik
- Reset konten dengan konfirmasi

## Pre-requisites
- Admin login aktif
- Supabase env (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) terpasang
- Tabel: `linktree`, `linktree_links`, `linktree_social_links`, `linktree_contact_info`

## Test Cases

### A. Profil LinkTree
- Edit `title`, `subtitle`, `description`, `avatar`
- Verifikasi tombol `Save Changes` menyimpan ke DB
- Biarkan edit mode aktif, ubah salah satu field, tunggu 30 detik → pastikan muncul notifikasi “Autosave berhasil” dan data tersimpan

### B. Links
- Tambah link baru (wajib `title`, `URL` valid)
- Edit link (ubah `title`, `URL`, `description`) → verify update
- Hapus link → konfirmasi muncul, item terhapus dari daftar
- Urutan link mengikuti `order_index`

### C. Social Media
- Tambah social (wajib `platform`, `value`; `URL` opsional dan harus valid bila diisi)
- Edit social → verify update
- Hapus social → verify deleted

### D. Contact Info
- Tambah contact (wajib `platform`, `value`; `URL` opsional dan harus valid bila diisi)
- Edit contact → verify update
- Hapus contact → verify deleted

### E. Live Preview
- Preview update real-time saat mengubah data di editor
- Toggle `Mobile/Desktop` mengubah lebar viewport preview
- Konten preview mencerminkan status `is_active`

### F. Reset Konten
- Klik `Reset Konten` → konfirmasi, semua items (links, social, contact) terhapus
- Profil tetap ada, data kosong sesuai skema

### G. Sinkronisasi Halaman Publik
- Buka `/linktree` → data yang tampil berasal dari DB
- Jika DB kosong, fallback ke `defaultLinktreeConfig`

## Notes
- Validasi URL: harus `http://` atau `https://`
- Gunakan `is_active` untuk sembunyikan item tanpa delete
- RLS harus benar agar admin bisa CRUD
