# Admin Dark Mode Palette (DIGCITY)

Tujuan: Menstandarkan palet dark mode untuk halaman admin sesuai spesifikasi agar konsisten, mudah dirawat, dan memenuhi aksesibilitas.

## Palet Warna Utama

- Background utama: `#121212`
- Teks utama: `rgba(255, 255, 255, 0.87)`
- Aksen/Primary: `#BB86FC`
- Secondary: `#03DAC6`
- Surface-1: `#1E1E1E`
- Surface-2: `#232323`
- Border muted: `#2A2A2A`

## Variabel CSS (aktif di `.dark`)

```css
:root.dark {
  --bg-main: #121212;
  --text-main: rgba(255, 255, 255, 0.87);
  --surface-1: #1E1E1E;
  --surface-2: #232323;
  --border-muted: #2A2A2A;
  --primary-accent: #BB86FC;
  --primary-accent-hover: #A870F0;
  --secondary-accent: #03DAC6;
  --secondary-accent-hover: #02C7B5;
}
```

## Pemetaan Kelas Tailwind (scoped ke Admin)

Scoping: seluruh override berada di dalam `.dark .admin-container` agar tidak memengaruhi halaman publik.

- `bg-white` → `var(--surface-1)`
- `bg-secondary-50` → `var(--surface-2)`
- `border-secondary-200` → `var(--border-muted)`
- `text-secondary-900` → `var(--text-main)`
- `text-secondary-700|600` → `rgba(255,255,255,0.8|0.7)`
- `bg-primary-600` → `var(--primary-accent)`
- `hover:bg-primary-700` → `var(--primary-accent-hover)`
- `bg-primary-50` → `rgba(187,134,252,0.12)`
- `border-primary-200` → `rgba(187,134,252,0.24)`

Catatan: kelas `neutral-*` yang digunakan sebelumnya pada komponen admin juga dioverride ke surface/border dark di admin.

## Komponen yang Tercakup

- Navigasi admin (header + sidebar)
- Tombol interaktif (termasuk `ThemeToggle` dan Quick Actions)
- Form input, select, textarea
- Tabel data
- Card informasi dan panel status/insight
- Notifikasi (provider global + styling dark)
- Ikon-ikon mengikuti `currentColor`; warna teks di area admin sudah dipetakan ke palet dark

## State Komponen

- Normal: warna sesuai mapping di atas.
- Hover: surface naik satu tingkat (Surface-2), atau `primary-accent-hover` untuk elemen beraksen.
- Active: gunakan peningkatan kontras (mis. tetap pada hover + `ring` bila sesuai).
- Disabled: `opacity: 0.5` (kelas `disabled:opacity-50`).
- Focus: gunakan `focus-ring` (global) → ring dengan `--primary-accent`.

## Aksesibilitas

- Kontras teks terhadap background mengikuti WCAG AA dengan tekstur `rgba(255,255,255,0.87)` di background `#121212`.
- Fokus terlihat jelas (`focus-ring`) dan tidak bergantung pada warna yang terlalu redup.
- Placeholder teks pada input diturunkan ke `rgba(255,255,255,0.6)` untuk keterbacaan.

## Responsivitas & Browser

- Responsif mengikuti grid dan utility Tailwind yang sudah ada.
- Override bersifat CSS standar, kompatibel dengan PostCSS/Vite; tidak menggunakan `color-mix` agar kompatibilitas tinggi.

## Lokasi Perubahan Kode

- `src/index.css`: deklarasi variabel dark dan override scoped `.admin-container`.
- `src/pages/AdminPanel.tsx`: wrapper `admin-container` + warna header/sidebar.
- `src/components/common/ThemeToggle.tsx`: warna dan ring sesuai palet.
- `src/components/admin/AdminDashboard.tsx`: background & border surface sesuai palet + transisi.

## Cara Uji

1. Buka `/admin/`, aktifkan toggle dark mode.
2. Periksa:
   - Header & sidebar: background, teks, border sesuai palet.
   - Tombol: normal/hover/disabled/focus.
   - Form & tabel: surface + teks + placeholder.
   - Card dan notifikasi: kontras dan keterbacaan.
3. Uji berbagai lebar layar (mobile → desktop).
4. Cek di browser utama (Chrome, Edge, Firefox). Jika ada ketidaksesuaian rendering, sesuaikan di `index.css` bagian override.

## Catatan Maintenance

- Semua override terkunci pada scope `.admin-container`. Jika ada komponen admin baru, pastikan berada di dalam kontainer ini.
- Gunakan utility `focus-ring` untuk konsistensi fokus.
- Untuk aksen di dark mode, gunakan kelas berbasis `primary` (`bg-primary-600`, `text-primary-700`) agar otomatis terpetakan.

