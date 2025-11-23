# Internal Organization Dashboard

Portal manajemen organisasi DIGCITY yang dapat diakses via `internal.digcity.my.id`.

## Quick Start

1. **Akses:** `https://internal.digcity.my.id` (production) atau setup localhost subdomain
2. **Login:** Gunakan akun Supabase Auth yang sudah terdaftar
3. **Fitur Utama:** Keuangan (Finance) - ✅ Ready
4. **Fitur Coming Soon:** Anggota, Absensi, Persuratan

## Struktur Komponen

```
internal/
├── InternalLogin.tsx       # Login page dengan branding internal
├── InternalDashboard.tsx  # Dashboard utama dengan ringkasan keuangan
├── FinancePage.tsx        # Halaman manajemen transaksi keuangan
└── TransactionForm.tsx   # Modal form untuk catat transaksi baru
```

## API Reference

### `financeAPI`

```typescript
// Get all transactions
const transactions = await financeAPI.getAll()

// Get summary (balance, income, expense)
const summary = await financeAPI.getSummary()

// Create new transaction
await financeAPI.create({
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string, // YYYY-MM-DD
  proof_url?: string,
  created_by: string // TODO: use auth.uid()
})

// Delete transaction
await financeAPI.delete(id)
```

## Database

**Table:** `finance_transactions`
- RLS enabled
- Policies: Authenticated users can read all, write own records
- Storage: `finance-proofs` bucket for proof files

**Migration:** `database/setup_finance_tables.sql` (already executed)

## UI Theme

- **Primary Color:** Blue (#2563eb)
- **Income Color:** Emerald/Green
- **Expense Color:** Rose/Red
- **Background:** Slate
- **Dark Mode:** ✅ Supported

## Development Notes

- Subdomain routing handled in `src/utils/domainDetection.ts`
- Main layout in `src/pages/InternalPanel.tsx`
- Separate auth system (not requiring admin role)
- Currency formatting: IDR (Indonesian Rupiah)

## Roadmap

- [ ] Upload file bukti langsung ke storage
- [ ] Database Anggota (CRUD)
- [ ] Sistem Absensi (QR Code)
- [ ] Manajemen Persuratan
- [ ] Export laporan Excel/PDF

Lihat dokumentasi lengkap: `docs/052_internal_organization_dashboard.md`

