import { DriveStep } from 'driver.js'

export interface TutorialDefinition {
    id: string
    title: string
    description: string
    pathStr: string // Path substring to match
    steps: DriveStep[]
}

export const TUTORIALS: TutorialDefinition[] = [
    // --- DASHBOARD ---
    {
        id: 'dashboard-intro',
        title: 'Pengenalan Dashboard',
        description: 'Pelajari fitur dasar dashboard internal DigCity.',
        pathStr: '/internal', // Matches root internal path
        steps: [
            {
                element: '#internal-dashboard-header',
                popover: {
                    title: 'Selamat Datang!',
                    description: 'Ini adalah pusat kontrol internal. Anda dapat melihat ringkasan aktivitas di sini.'
                }
            },
            {
                element: '#sidebar-nav',
                popover: {
                    title: 'Menu Navigasi',
                    description: 'Gunakan sidebar ini untuk mengakses modul lain seperti Keuangan, Program Kerja, dll.'
                }
            },
            {
                element: '#user-profile-section',
                popover: {
                    title: 'Profil & Akun',
                    description: 'Kelola akun Anda atau log out melalui menu ini.'
                }
            }
        ]
    },

    // --- FINANCIAL ---
    {
        id: 'finance-overview',
        title: 'Overview Keuangan',
        description: 'Pelajari cara membaca laporan dan grafik keuangan.',
        pathStr: '/internal/finance',
        steps: [
            {
                element: '#finance-overview-cards',
                popover: {
                    title: 'Ringkasan Cepat',
                    description: 'Kartu ini menampilkan total Pemasukan, Pengeluaran, dan Sisa Saldo saat ini.'
                }
            },
            {
                element: '#finance-charts',
                popover: {
                    title: 'Analisis Grafik',
                    description: 'Pantau tren keuangan per bulan melalui grafik batang ini.'
                }
            },
            {
                element: '#finance-transactions-list',
                popover: {
                    title: 'Riwayat Transaksi',
                    description: 'Daftar seluruh transaksi tercatat di sini. Anda bisa mengedit atau menghapus jika ada kesalahan (dan memiliki hak akses).'
                }
            }
        ]
    },
    {
        id: 'finance-add',
        title: 'Catat Transaksi',
        description: 'Tutorial cara mencatat pemasukan atau pengeluaran baru.',
        pathStr: '/internal/finance',
        steps: [
            {
                element: '#finance-create-btn',
                popover: {
                    title: 'Tombol Tambah',
                    description: 'Klik tombol ini untuk membuka form pencatatan transaksi baru.'
                }
            },
            {
                element: '#finance-action-buttons',
                popover: {
                    title: 'Fitur Lainnya',
                    description: 'Di sini juga terdapat tombol untuk Export Laporan (PDF/CSV) dan Import Data dari Excel.'
                }
            }
        ]
    },

    // --- KPI ---
    {
        id: 'kpi-general',
        title: 'Penjelasan Halaman KPI',
        description: 'Memahami cara membaca dan mengelola KPI anggota.',
        pathStr: '/internal/kpi',
        steps: [
            {
                element: '#kpi-header',
                popover: {
                    title: 'KPI Anggota',
                    description: 'Halaman ini digunakan untuk memantau kinerja anggota tiap periode.'
                }
            },
            {
                element: '#kpi-search',
                popover: {
                    title: 'Pencarian',
                    description: 'Filter anggota berdasarkan nama atau divisi untuk menemukan data dengan cepat.'
                }
            },
            {
                element: '#kpi-table-bph',
                popover: {
                    title: 'Tabel Anggota',
                    description: 'Data dikelompokkan per divisi. Anda dapat melihat nilai dan melakukan penilaian (Edit) jika memiliki akses.'
                }
            }
        ]
    },

    // --- MEMBERS ---
    {
        id: 'members-general',
        title: 'Database Anggota',
        description: 'Kelola data seluruh anggota dan pengurus organisasi.',
        pathStr: '/internal/members',
        steps: [
            {
                element: '#members-header',
                popover: {
                    title: 'Database Anggota',
                    description: 'Halaman ini menyimpan seluruh data anggota aktif, cuti, maupun alumni.'
                }
            },
            {
                element: '#members-filters',
                popover: {
                    title: 'Filter & Pencarian',
                    description: 'Gunakan filter untuk menampilkan kategori tertentu (misal: hanya anggota Aktif) atau cari berdasarkan nama.'
                }
            },
            {
                element: '#members-content',
                popover: {
                    title: 'Daftar Anggota',
                    description: 'Klik ikon QR Code untuk melihat Kartu Anggota Digital, atau ikon titik tiga untuk mengedit data.'
                }
            }
        ]
    },
    {
        id: 'members-manage',
        title: 'Tambah & Import Anggota',
        description: 'Cara menambahkan data anggota baru ke sistem.',
        pathStr: '/internal/members',
        steps: [
            {
                element: '#members-add-btn',
                popover: {
                    title: 'Tambah Manual',
                    description: 'Klik tombol ini untuk input data satu per satu melalui formulir.'
                }
            },
            {
                element: '#members-import',
                popover: {
                    title: 'Import Excel',
                    description: 'Gunakan fitur ini untuk memasukkan banyak data sekaligus dari file Excel.'
                }
            },
            {
                element: '#members-export',
                popover: {
                    title: 'Export Data',
                    description: 'Unduh rekap data anggota dalam format CSV untuk kebutuhan administrasi.'
                }
            }
        ]
    },

    // --- ATTENDANCE ---
    {
        id: 'attendance-general',
        title: 'Agenda & Presensi',
        description: 'Kelola jadwal kegiatan dan pantau kehadiran.',
        pathStr: '/internal/attendance',
        steps: [
            {
                element: '#attendance-header',
                popover: {
                    title: 'Pusat Kegiatan',
                    description: 'Jadwalkan rapat, proker, atau gathering di sini.'
                }
            },
            {
                element: '#attendance-stats',
                popover: {
                    title: 'Statistik Singkat',
                    description: 'Lihat ringkasan total agenda dan persentase kehadiran rata-rata organisasi.'
                }
            },
            {
                element: '#attendance-content',
                popover: {
                    title: 'Daftar Agenda',
                    description: 'Agenda yang akan datang dan yang sudah lewat ditampilkan di sini. Anda bisa mengubah tampilan ke mode Kalender.'
                }
            },
            {
                element: '#attendance-performance-stats',
                popover: {
                    title: 'Analisis Keaktifan',
                    description: 'Grafik ini menunjukkan perbandingan keaktifan antar divisi dan performa kepanitiaan.'
                }
            }
        ]
    },
    {
        id: 'attendance-actions',
        title: 'Buat Agenda & Scan QR',
        description: 'Cara membuat jadwal baru dan melakukan presensi.',
        pathStr: '/internal/attendance',
        steps: [
            {
                element: '#attendance-create-btn',
                popover: {
                    title: 'Buat Agenda Baru',
                    description: 'Klik untuk membuat jadwal. QR Code presensi akan otomatis dibuat setelah agenda tersimpan.'
                }
            },
            {
                element: '#attendance-scanner-btn',
                popover: {
                    title: 'Scan QR Presensi',
                    description: 'Gunakan fitur ini untuk memindai QR Code anggota yang hadir (jika menggunakan device ini sebagai station presensi).'
                }
            }
        ]
    },

    // --- WORK PROGRAMS ---
    {
        id: 'work-programs-general',
        title: 'Manajemen Program Kerja',
        description: 'Kelola proker, anggaran (RAB), dan status kegiatan.',
        pathStr: '/internal/work-programs',
        steps: [
            {
                element: '#work-programs-header',
                popover: {
                    title: 'Program Kerja',
                    description: 'Halaman ini untuk memonitor progres program kerja tiap divisi.'
                }
            },
            {
                element: '#work-programs-add-btn',
                popover: {
                    title: 'Tambah Proker',
                    description: 'Buat rencana program kerja baru, termasuk menetapkan anggaran dan jadwal pelaksanaannya.'
                }
            },
            {
                element: '#work-programs-grid',
                popover: {
                    title: 'Daftar Proker',
                    description: 'Klik salah satu program kerja untuk melihat detail realisasi anggaran dan laporan.'
                }
            }
        ]
    },

    // --- INVENTORY ---
    {
        id: 'inventory-general',
        title: 'Inventaris Sekretariat',
        description: 'Pencatatan aset dan barang milik organisasi.',
        pathStr: '/internal/inventory',
        steps: [
            {
                element: '#inventory-header',
                popover: {
                    title: 'Inventaris Barang',
                    description: 'Kelola data aset di sekretariat, termasuk status kondisi barang.'
                }
            },
            {
                element: '#inventory-stats',
                popover: {
                    title: 'Ringkasan Aset',
                    description: 'Pantau total nilai aset dan barang yang memerlukan perbaikan atau rusak.'
                }
            },
            {
                element: '#inventory-add-btn',
                popover: {
                    title: 'Tambah Barang',
                    description: 'Catat barang baru yang masuk ke inventaris.'
                }
            },
            {
                element: '#inventory-filters',
                popover: {
                    title: 'Cari & Filter',
                    description: 'Temukan barang berdasarkan kategori atau kondisi fisiknya.'
                }
            }
        ]
    },

    // --- DOCUMENTS ---
    {
        id: 'documents-general',
        title: 'Administrasi & Persuratan',
        description: 'Arsip surat masuk, keluar, dan dokumen legalitas.',
        pathStr: '/internal/documents',
        steps: [
            {
                element: '#documents-header',
                popover: {
                    title: 'Arsip Dokumen',
                    description: 'Pusat penyimpanan dokumen digital organisasi.'
                }
            },
            {
                element: '#documents-templates-btn',
                popover: {
                    title: 'Template Surat',
                    description: 'Unduh template standar untuk surat tugas, undangan, dll.'
                }
            },
            {
                element: '#documents-add-btn',
                popover: {
                    title: 'Buat/Upload Dokumen',
                    description: 'Buat surat keluar baru (dengan penomoran otomatis) atau upload arsip surat masuk.'
                }
            },
            {
                element: '#documents-filters',
                popover: {
                    title: 'Kategori Dokumen',
                    description: 'Filter dokumen berdasarkan jenis: Surat Masuk, Keluar, atau LPJ.'
                }
            }
        ]
    },

    // --- ACTIVITY ---
    {
        id: 'activity-general',
        title: 'Log Aktivitas',
        description: 'Audit trail tindakan pengguna dalam sistem.',
        pathStr: '/internal/activity',
        steps: [
            {
                element: '#activity-header',
                popover: {
                    title: 'Audit Log',
                    description: 'Merekam jejak digital aktivitas penting seperti transaksi keuangan, edit anggota, dll.'
                }
            },
            {
                element: '#activity-filters',
                popover: {
                    title: 'Filter Log',
                    description: 'Cari aktivitas spesifik berdasarkan modul atau kata kunci.'
                }
            },
            {
                element: '#activity-list',
                popover: {
                    title: 'Timeline',
                    description: 'Daftar aktivitas diurutkan berdasarkan waktu terbaru.'
                }
            }
        ]
    },

    // --- ORGANIZATION SETTINGS ---
    {
        id: 'org-settings-general',
        title: 'Pengaturan Organisasi',
        description: 'Konfigurasi profil, jabatan, dan struktur organisasi.',
        pathStr: '/internal/org',
        steps: [
            {
                element: '#org-settings-header',
                popover: {
                    title: 'Panel Admin',
                    description: 'Halaman ini khusus untuk Ketua/Sekretaris/Admin untuk mengelola data inti organisasi.'
                }
            },
            {
                element: '#org-profile-section',
                popover: {
                    title: 'Identitas Organisasi',
                    description: 'Ubah nama, logo, dan periode kepengurusan aktif di sini.'
                }
            },
            {
                element: '#org-divisions-management',
                popover: {
                    title: 'Kelola Divisi',
                    description: 'Tambah, hapus, atau ubah urutan divisi dengan drag-and-drop.'
                }
            },
            {
                element: '#org-positions-management',
                popover: {
                    title: 'Struktur Jabatan',
                    description: 'Definisikan level jabatan (Ketua, Kadiv, Anggota) untuk hierarki organisasi.'
                }
            },
            {
                element: '#org-succession-section',
                popover: {
                    title: 'Estafet Kepengurusan',
                    description: 'Fitur krusial untuk melakukan pergantian periode. Gunakan dengan hati-hati saat LPJ akhir tahun.'
                }
            }
        ]
    }
]
