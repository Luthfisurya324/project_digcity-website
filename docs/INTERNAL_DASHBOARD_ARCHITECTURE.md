# Internal Dashboard - Quick Architecture Reference

## Subdomain Routing Map

```
digcity.my.id          → Website Publik (HomePage, Blog, Events, Gallery, dll)
admin.digcity.my.id    → Admin Website (Events, News, Gallery Management)
internal.digcity.my.id → Internal Dashboard (Finance, Members, Attendance, Documents)
linktree.digcity.my.id → Linktree Page (Bio Link)
```

## Current Status

### ✅ Implemented (MVP)
- **Finance Management:**
  - Dashboard dengan ringkasan keuangan
  - CRUD transaksi (pemasukan/pengeluaran)
  - Filter & search transaksi
  - Database: `finance_transactions` table
  - Storage: `finance-proofs` bucket

### 🚧 Planned (Roadmap)
- **Members Database** - `/members`
- **Attendance System** - `/attendance` 
- **Document Management** - `/documents`

## Key Files

### Routing
- `src/utils/domainDetection.ts` - Subdomain detection
- `src/App.tsx` - Main routing logic

### Components
- `src/pages/InternalPanel.tsx` - Main layout & navigation
- `src/components/internal/InternalLogin.tsx` - Login page
- `src/components/internal/InternalDashboard.tsx` - Dashboard home
- `src/components/internal/FinancePage.tsx` - Finance management
- `src/components/internal/TransactionForm.tsx` - Transaction form

### API
- `src/lib/supabase.ts` - `financeAPI` functions

### Database
- `database/setup_finance_tables.sql` - Migration script (already executed)

## API Usage Example

```typescript
import { financeAPI } from '../lib/supabase'

// Get summary
const summary = await financeAPI.getSummary()
// Returns: { totalIncome, totalExpense, balance }

// Get all transactions
const transactions = await financeAPI.getAll()

// Create transaction
await financeAPI.create({
  type: 'income',
  amount: 100000,
  category: 'Uang Kas',
  description: 'Iuran bulanan',
  date: '2025-11-22',
  proof_url: 'https://...',
  created_by: 'user-id-here'
})
```

## Authentication

- Uses Supabase Auth (same as admin)
- **No admin role required** - any authenticated user can access
- Future: Can add `internal_member` role check if needed

## UI Theme

- Primary: Blue (#2563eb)
- Income: Emerald/Green
- Expense: Rose/Red
- Background: Slate
- Dark mode: ✅ Supported

## Next Development Steps

1. Fix `created_by` to use `auth.uid()` from context
2. Implement file upload to storage bucket
3. Add Members feature (table + UI)
4. Add Attendance feature (QR code generation)
5. Add Documents feature (PDF upload & management)

Lihat dokumentasi lengkap: `docs/052_internal_organization_dashboard.md`

