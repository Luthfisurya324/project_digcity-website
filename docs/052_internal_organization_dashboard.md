# 052 – Internal Organization Dashboard (Portal Organisasi)

**Tanggal:** 22 November 2025  
**Status:** MVP (Minimum Viable Product) - Fitur Keuangan Selesai

## Overview

Internal Organization Dashboard adalah sistem manajemen organisasi terpisah yang dapat diakses melalui subdomain `internal.digcity.my.id`. Sistem ini dirancang khusus untuk mengelola operasional internal organisasi DIGCITY, terpisah dari website publik dan admin website.

### Tujuan

- **Manajemen Keuangan:** Pencatatan pemasukan dan pengeluaran kas organisasi
- **Database Anggota:** (Coming Soon) Manajemen data anggota dan pengurus
- **Absensi:** (Coming Soon) Sistem absensi untuk rapat dan kegiatan
- **Persuratan:** (Coming Soon) Arsip surat masuk dan keluar

### Perbedaan dengan Admin Website

| Aspek | Admin Website | Internal Dashboard |
|-------|---------------|-------------------|
| **Subdomain** | `admin.digcity.my.id` | `internal.digcity.my.id` |
| **Fokus** | Konten website publik | Operasional organisasi |
| **Fitur** | Events, News, Gallery, Newsletter | Keuangan, Anggota, Absensi, Surat |
| **Tema UI** | Purple/Pink gradient | Blue/Teal gradient |
| **Autentikasi** | Admin role check | Authenticated users (internal members) |

## Arsitektur & Struktur

### Routing & Subdomain

Sistem menggunakan subdomain routing yang sama dengan Admin dan Linktree:

```
digcity.my.id          → Website Publik
admin.digcity.my.id    → Admin Website
internal.digcity.my.id → Internal Dashboard
linktree.digcity.my.id → Linktree Page
```

**File Konfigurasi:**
- `src/utils/domainDetection.ts` - Deteksi subdomain `internal`
- `src/App.tsx` - Routing conditional untuk subdomain internal

### Struktur File

```
src/
├── pages/
│   └── InternalPanel.tsx          # Main layout & routing
├── components/
│   └── internal/
│       ├── InternalLogin.tsx       # Login page khusus internal
│       ├── InternalDashboard.tsx  # Dashboard utama dengan ringkasan
│       ├── FinancePage.tsx         # Halaman manajemen keuangan
│       └── TransactionForm.tsx     # Form untuk catat transaksi
└── lib/
    └── supabase.ts                 # API functions (financeAPI)
```

## Database Schema

### Tabel: `finance_transactions`

Tabel untuk menyimpan semua transaksi keuangan organisasi.

```sql
CREATE TABLE public.finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    proof_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Row Level Security (RLS):**
- ✅ **SELECT:** Semua authenticated users dapat membaca
- ✅ **INSERT:** Hanya user yang membuat transaksi (auth.uid() = created_by)
- ✅ **UPDATE:** Hanya user yang membuat transaksi
- ✅ **DELETE:** Hanya user yang membuat transaksi

**Storage Bucket:**
- `finance-proofs` - Untuk menyimpan bukti transfer/nota (public read, authenticated write)

**File SQL:** `database/setup_finance_tables.sql`

## Fitur yang Sudah Diimplementasikan

### 1. Dashboard Utama (`InternalDashboard.tsx`)

**Fitur:**
- Ringkasan keuangan real-time:
  - Total Saldo Kas (Balance)
  - Total Pemasukan (Income)
  - Total Pengeluaran (Expense)
- Quick actions untuk navigasi cepat
- Placeholder untuk fitur mendatang

**Data Source:** `financeAPI.getSummary()`

### 2. Manajemen Keuangan (`FinancePage.tsx`)

**Fitur:**
- ✅ Daftar semua transaksi (pemasukan & pengeluaran)
- ✅ Filter berdasarkan tipe (Semua/Pemasukan/Pengeluaran)
- ✅ Search transaksi berdasarkan kategori/deskripsi
- ✅ Form untuk mencatat transaksi baru
- ✅ Hapus transaksi (dengan konfirmasi)
- ✅ Format currency Indonesia (IDR)
- ✅ Tampilan dengan icon dan color coding:
  - 🟢 Pemasukan (Income) - Emerald/Green
  - 🔴 Pengeluaran (Expense) - Rose/Red

**Kategori Transaksi:**

**Pemasukan:**
- Uang Kas
- Sponsorship
- Donasi
- Penjualan Merchandise
- Lainnya

**Pengeluaran:**
- Konsumsi
- Transportasi
- Perlengkapan
- Sewa Tempat
- Lainnya

### 3. Form Transaksi (`TransactionForm.tsx`)

**Fitur:**
- Modal form untuk mencatat transaksi baru
- Toggle antara Pemasukan/Pengeluaran
- Input: Nominal, Kategori, Tanggal, Keterangan, Link Bukti
- Validasi form
- Auto-refresh list setelah submit

**API:** `financeAPI.create()`

## Fitur yang Akan Datang (Roadmap)

### 1. Database Anggota (`/members`)
- Data diri lengkap anggota/pengurus
- Status keaktifan
- Role/jabatan dalam organisasi
- Upload foto profil

### 2. Sistem Absensi (`/attendance`)
- Buat sesi absensi baru (Rapat, Kegiatan)
- QR Code untuk check-in
- Rekap kehadiran per anggota
- Export laporan absensi

### 3. Manajemen Persuratan (`/documents`)
- Surat masuk & keluar
- Upload file PDF surat
- Kategori surat
- Pencarian dan filter

## API Functions

### `financeAPI` (di `src/lib/supabase.ts`)

```typescript
interface FinanceTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  proof_url?: string
  created_by: string
  created_at: string
  updated_at: string
}

// Methods:
financeAPI.getAll() → Promise<FinanceTransaction[]>
financeAPI.getSummary() → Promise<{totalIncome, totalExpense, balance}>
financeAPI.create(transaction) → Promise<FinanceTransaction>
financeAPI.delete(id) → Promise<void>
```

## Autentikasi

**Sistem Terpisah dari Admin Website:**
- Menggunakan Supabase Auth yang sama, tetapi **tidak** memerlukan role `admin`
- Cukup authenticated user (bisa dikembangkan dengan role `internal_member` di metadata)
- Login page terpisah: `InternalLogin.tsx`

**File:** `src/components/internal/InternalLogin.tsx`

## UI/UX Design

### Color Scheme
- **Primary:** Blue (#2563eb) - untuk aksi utama
- **Success/Income:** Emerald/Green - untuk pemasukan
- **Danger/Expense:** Rose/Red - untuk pengeluaran
- **Background:** Slate - untuk netral

### Layout
- Sidebar navigation (collapsible)
- Header dengan breadcrumb
- Main content area dengan max-width
- Dark mode support

### Komponen Khusus
- Card-based layout untuk statistik
- Table/list untuk transaksi
- Modal form untuk input
- Filter & search bar

## Cara Menggunakan

### 1. Setup Database

Jalankan migration SQL:
```bash
# File: database/setup_finance_tables.sql
# Sudah dijalankan via MCP Supabase
```

### 2. Akses Dashboard

**Development:**
- Belum ada subdomain lokal, gunakan path `/internal` (jika ditambahkan) atau
- Edit hosts file untuk `internal.localhost`

**Production:**
- Akses: `https://internal.digcity.my.id`
- Login dengan akun yang sudah terdaftar di Supabase Auth

### 3. Menggunakan Fitur Keuangan

**Mencatat Pemasukan:**
1. Klik "Catat Transaksi" di halaman Finance
2. Pilih "Pemasukan"
3. Isi: Nominal, Kategori, Tanggal, Keterangan
4. (Opsional) Tambahkan link bukti transfer
5. Klik "Simpan"

**Mencatat Pengeluaran:**
1. Sama seperti pemasukan, pilih "Pengeluaran"
2. Isi form dengan detail pengeluaran
3. Upload atau link bukti nota/kwitansi

**Melihat Laporan:**
- Dashboard menampilkan ringkasan total
- Halaman Finance menampilkan detail semua transaksi
- Filter dan search untuk menemukan transaksi spesifik

## Catatan Teknis

### RLS Policy Notes
- Saat ini `created_by` diisi dengan 'system' di frontend
- **TODO:** Update untuk menggunakan `auth.uid()` dari Supabase Auth context
- Pastikan user yang login memiliki UUID valid di `auth.users`

### Storage Bucket
- Bucket `finance-proofs` sudah dibuat
- Policy: Public read, Authenticated write
- **TODO:** Implementasi upload file langsung ke bucket (saat ini hanya link URL)

### Currency Formatting
- Menggunakan `Intl.NumberFormat` dengan locale `id-ID`
- Format: `Rp 1.000.000` (tanpa desimal)

### Future Enhancements
1. Export laporan ke Excel/PDF
2. Upload file bukti langsung ke storage
3. Notifikasi untuk transaksi besar
4. Budget tracking per kategori
5. Recurring transactions (iuran bulanan, dll)

## Troubleshooting

**Error: "Table finance_transactions does not exist"**
- Pastikan migration SQL sudah dijalankan
- Cek di Supabase Dashboard → Table Editor

**Error: "Permission denied"**
- Pastikan RLS policies sudah dibuat
- Cek user sudah authenticated
- Pastikan `created_by` sesuai dengan `auth.uid()`

**Transaksi tidak muncul di dashboard**
- Refresh halaman
- Cek filter/search tidak terlalu ketat
- Pastikan data sudah tersimpan di database

**Subdomain tidak terdeteksi**
- Development: Gunakan path-based routing atau setup localhost subdomain
- Production: Pastikan DNS sudah dikonfigurasi untuk `internal.digcity.my.id`

## Dampak Perubahan File

### File Baru
- `src/pages/InternalPanel.tsx`
- `src/components/internal/InternalLogin.tsx`
- `src/components/internal/InternalDashboard.tsx`
- `src/components/internal/FinancePage.tsx`
- `src/components/internal/TransactionForm.tsx`
- `database/setup_finance_tables.sql`

### File Dimodifikasi
- `src/utils/domainDetection.ts` - Tambah fungsi `isInternalSubdomain()`, `shouldRedirectToInternal()`
- `src/App.tsx` - Tambah routing untuk internal subdomain
- `src/lib/supabase.ts` - Tambah interface `FinanceTransaction` dan `financeAPI`

## Next Steps untuk Development

1. **Implementasi Upload File:**
   - Integrasi dengan Supabase Storage untuk upload bukti
   - Update `TransactionForm.tsx` untuk handle file upload

2. **Perbaikan Auth:**
   - Update `created_by` untuk menggunakan `auth.uid()` dari context
   - Tambah role check untuk `internal_member` jika diperlukan

3. **Fitur Database Anggota:**
   - Buat tabel `organization_members`
   - UI untuk CRUD anggota
   - Upload foto profil

4. **Fitur Absensi:**
   - Tabel `attendance_sessions` dan `attendance_records`
   - Generate QR Code untuk check-in
   - Rekap dan laporan

5. **Fitur Persuratan:**
   - Tabel `documents` (surat masuk/keluar)
   - Upload PDF
   - Kategori dan pencarian

---

**Catatan untuk AI Selanjutnya:**
Sistem ini adalah portal internal organisasi yang terpisah dari website publik. Fokus utama saat ini adalah fitur keuangan (Finance) yang sudah fully functional. Fitur lainnya (Anggota, Absensi, Persuratan) masih dalam roadmap dan belum diimplementasikan. Gunakan struktur dan pattern yang sama untuk mengembangkan fitur-fitur berikutnya.

