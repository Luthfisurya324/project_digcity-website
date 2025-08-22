# Update Alamat Kontak DIGCITY

## Deskripsi Perubahan
Mengubah alamat kontak dari alamat dummy menjadi alamat resmi sekretariat DIGCITY di Universitas Ibn Khaldun Bogor.

## Detail Perubahan

### Sebelum Update
```tsx
content: 'Gedung Fakultas Teknik\nUniversitas XYZ\nJl. Teknologi No. 123\nJakarta 12345',
```

### Sesudah Update
```tsx
content: 'Sekretariat Organisasi Mahasiswa (Ormawa) FEB\nDIGCITY\nJl. Sholeh Iskandar No.Km.02, RT.01/RW.010\nKedungbadak, Kec. Tanah Sereal\nKota Bogor, Jawa Barat 16162',
```

## Informasi Alamat Baru

### Lokasi
- **Sekretariat**: Organisasi Mahasiswa (Ormawa) FEB
- **Organisasi**: DIGCITY
- **Alamat Lengkap**: Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010
- **Kelurahan**: Kedungbadak
- **Kecamatan**: Tanah Sereal
- **Kota**: Bogor
- **Provinsi**: Jawa Barat
- **Kode Pos**: 16162

### Struktur Alamat
1. **Baris 1**: Sekretariat Organisasi Mahasiswa (Ormawa) FEB
2. **Baris 2**: DIGCITY
3. **Baris 3**: Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010
4. **Baris 4**: Kedungbadak, Kec. Tanah Sereal
5. **Baris 5**: Kota Bogor, Jawa Barat 16162

## File yang Diubah

### Lokasi File
- **Path**: `src/components/KontakPage.tsx`
- **Line**: 42
- **Component**: `KontakPage`

### Struktur Data
```tsx
const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Alamat',
    content: 'Sekretariat Organisasi Mahasiswa (Ormawa) FEB\nDIGCITY\nJl. Sholeh Iskandar No.Km.02, RT.01/RW.010\nKedungbadak, Kec. Tanah Sereal\nKota Bogor, Jawa Barat 16162',
    action: null
  },
  // ... other contact info
];
```

## Alasan Perubahan

### 1. Akurasi Informasi
- Mengganti alamat dummy dengan alamat resmi
- Memberikan informasi yang akurat kepada pengunjung website
- Memudahkan kontak langsung ke sekretariat

### 2. Profesionalisme
- Menampilkan informasi organisasi yang profesional
- Meningkatkan kredibilitas website DIGCITY
- Memberikan kesan serius dan terorganisir

### 3. User Experience
- Pengunjung dapat menemukan lokasi yang tepat
- Memudahkan koordinasi untuk event atau pertemuan
- Informasi kontak yang lengkap dan jelas

## Dampak Perubahan

### 1. Tampilan Website
- Alamat yang ditampilkan lebih panjang
- Layout tetap rapi karena menggunakan `\n` untuk line break
- Responsive design tetap terjaga

### 2. Informasi Kontak
- Alamat yang akurat dan dapat diandalkan
- Detail lokasi yang lengkap
- Kode pos yang jelas untuk pengiriman surat

### 3. SEO dan Accessibility
- Informasi lokasi yang lebih spesifik
- Memudahkan pencarian lokasi di Google Maps
- Data yang akurat untuk business listing

## Testing

### Test yang Perlu Dilakukan
1. **Tampilan Alamat**: Pastikan alamat ditampilkan dengan benar
2. **Line Break**: Periksa apakah `\n` berfungsi dengan baik
3. **Responsiveness**: Test di berbagai ukuran layar
4. **Copy Text**: Pastikan alamat dapat di-copy dengan benar

### Cara Test
1. Buka halaman kontak
2. Periksa bagian alamat
3. Pastikan setiap baris alamat terpisah dengan benar
4. Test di mobile dan desktop
5. Copy alamat untuk verifikasi

## Verifikasi Alamat

### Google Maps
- **Koordinat**: Dapat dicari dengan "Jl. Sholeh Iskandar Bogor"
- **Landmark**: Dekat dengan Universitas Ibn Khaldun Bogor
- **Akses**: Mudah diakses dari pusat kota Bogor

### Transportasi
- **Angkot**: Tersedia rute angkot ke lokasi
- **Ojek Online**: Dapat diakses dengan aplikasi ride-hailing
- **Parkir**: Tersedia area parkir untuk kendaraan

## Best Practices

### 1. Format Alamat
- Gunakan line break (`\n`) untuk memisahkan baris
- Struktur alamat yang logis dan mudah dibaca
- Informasi yang lengkap dan akurat

### 2. Konsistensi
- Format alamat yang konsisten dengan standar Indonesia
- Penggunaan bahasa yang formal dan profesional
- Informasi yang up-to-date

### 3. User Experience
- Alamat yang mudah dibaca dan dipahami
- Informasi yang dapat di-copy dengan mudah
- Layout yang rapi dan tidak berantakan

## Maintenance

### Update Berkala
- Periksa akurasi alamat secara berkala
- Update jika ada perubahan lokasi sekretariat
- Verifikasi dengan tim organisasi

### Backup Data
- Simpan alamat lama sebagai referensi
- Dokumentasikan perubahan alamat
- Backup file sebelum melakukan perubahan

## Referensi

### Standar Alamat Indonesia
- Format alamat resmi Indonesia
- Penggunaan kode pos yang benar
- Struktur alamat yang standar

### Universitas Ibn Khaldun Bogor
- Lokasi kampus utama
- Fakultas Ekonomi dan Bisnis (FEB)
- Organisasi mahasiswa yang aktif

### DIGCITY
- Himpunan Mahasiswa Bisnis Digital
- Struktur organisasi yang jelas
- Lokasi sekretariat yang tetap

## Catatan Penting

- **Koordinat GPS**: Dapat ditambahkan untuk memudahkan navigasi
- **Jam Operasional**: Sesuaikan dengan jam kerja sekretariat
- **Kontak Person**: Pastikan informasi kontak person tetap akurat
- **Update Website**: Periksa apakah ada halaman lain yang perlu diupdate

## Troubleshooting

### Jika alamat tidak tampil dengan benar
1. Periksa penggunaan `\n` untuk line break
2. Pastikan tidak ada karakter khusus yang rusak
3. Test di browser yang berbeda

### Jika layout berantakan
1. Periksa CSS untuk styling alamat
2. Pastikan responsive design tetap terjaga
3. Test di berbagai ukuran layar

### Jika informasi tidak akurat
1. Verifikasi dengan tim organisasi
2. Periksa sumber informasi alamat
3. Update sesuai dengan data terbaru
