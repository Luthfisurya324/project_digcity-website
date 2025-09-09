import React from 'react';
import { Award, AlertTriangle, BookMarked, Users, Rocket } from 'lucide-react';

const SejarahPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-primary-400 to-secondary-400" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-secondary-300 to-primary-300" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-secondary-300" />
          </svg>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-sm mb-4">
                <BookMarked className="w-4 h-4 text-primary-500" />
                History & Journey
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Sejarah DIGCITY
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Perjalanan panjang Digital Business Student Society dalam mengembangkan ekosistem bisnis digital mahasiswa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Perjalanan DIGCITY
            </h2>
            <p className="text-lg text-secondary-600">
              Timeline perkembangan organisasi dari masa ke masa
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200 hidden lg:block"></div>

            <div className="space-y-12">
              {/* 20 Desember 2022 - Pendirian */}
              <div className="flex items-center lg:justify-between">
                <div className="w-full lg:w-5/12 lg:pr-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-primary-200 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                      <span className="text-primary-600 font-semibold">20 Desember 2022</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Pendirian DIGCITY</h3>
                    <p className="text-secondary-600">DIGCITY didirikan oleh 11 orang mahasiswa angkatan 1 Bisnis Digital yang saat itu masih semester 2. Mereka mendapat rekomendasi dari kepala program studi untuk membentuk himpunan mahasiswa.</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="hidden lg:block w-5/12"></div>
              </div>

              {/* Periode Pertama - Samansah Abbas Ras */}
              <div className="flex items-center lg:justify-between lg:flex-row-reverse">
                <div className="w-full lg:w-5/12 lg:pl-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-200 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-secondary-500 rounded-full mr-3"></div>
                      <span className="text-secondary-600 font-semibold">Generasi Pertama</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Ketua Pertama: Samansah Abbas Ras</h3>
                    <p className="text-secondary-600">Periode kepemimpinan pertama dengan fokus membangun fondasi organisasi, struktur himpunan, divisi-divisi, dan badan pengurus harian pertama. Belajar dari himpunan lain yang sudah berpengalaman.</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-4 h-4 bg-secondary-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="hidden lg:block w-5/12"></div>
              </div>

              {/* Periode Kedua - Muhammad Tiaz Azikri */}
              <div className="flex items-center lg:justify-between">
                <div className="w-full lg:w-5/12 lg:pr-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-accent-200 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-accent-500 rounded-full mr-3"></div>
                      <span className="text-accent-600 font-semibold">Generasi Kedua</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Ketua Kedua: Muhammad Tiaz Azikri</h3>
                    <p className="text-secondary-600">Periode kepemimpinan kedua yang melanjutkan estafet dari angkatan 1. Fokus pada pengembangan dan konsolidasi organisasi yang telah dibangun sebelumnya.</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-4 h-4 bg-accent-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="hidden lg:block w-5/12"></div>
              </div>

              {/* Periode Ketiga - Luthfi Surya Saputra */}
              <div className="flex items-center lg:justify-between lg:flex-row-reverse">
                <div className="w-full lg:w-5/12 lg:pl-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-green-600 font-semibold">Generasi Ketiga (Sekarang)</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Ketua Ketiga: Luthfi Surya Saputra</h3>
                    <p className="text-secondary-600">Periode kepemimpinan saat ini yang dipimpin oleh angkatan 2 (semester 5). Melanjutkan visi dan misi organisasi dengan inovasi-inovasi baru.</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="hidden lg:block w-5/12"></div>
              </div>

              {/* Kondisi Saat Ini */}
              <div className="flex items-center lg:justify-between">
                <div className="w-full lg:w-5/12 lg:pr-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-200 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-purple-600 font-semibold">Kondisi Saat Ini</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">Tiga Generasi Bersatu</h3>
                    <p className="text-secondary-600">Angkatan 1 (semester 7), Angkatan 2 (semester 5 - pengurus saat ini), dan Angkatan 3 (anggota biasa) bekerja sama membangun DIGCITY yang lebih besar.</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="hidden lg:block w-5/12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Learning Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Perjalanan Penuh Tantangan
            </h2>
            <p className="text-lg text-secondary-600">
              Proses membangun DIGCITY dari nol dengan berbagai hambatan dan pembelajaran
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-100">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Tantangan Utama</h3>
              <ul className="text-secondary-600 space-y-2">
                <li>• Membangun organisasi tanpa panduan dari senior</li>
                <li>• Mempelajari tata kelola organisasi secara mandiri</li>
                <li>• Menciptakan identitas dan struktur organisasi baru</li>
                <li>• Membuktikan eksistensi di lingkungan akademik</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <BookMarked className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Strategi Pembelajaran</h3>
              <ul className="text-secondary-600 space-y-2">
                <li>• Mengadopsi praktik terbaik dari himpunan yang sudah mapan</li>
                <li>• Mempelajari struktur organisasi mahasiswa yang efektif</li>
                <li>• Merancang identitas visual dan brand organisasi</li>
                <li>• Membentuk divisi-divisi sesuai kebutuhan program studi</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-100">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Komitmen Berkelanjutan</h3>
              <p className="text-secondary-600 leading-relaxed">
                Para pendiri konsisten membangun fondasi organisasi yang kuat melalui dedikasi dan kerja keras yang terukur.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl border border-secondary-100">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Pengembangan Kapasitas</h3>
              <p className="text-secondary-600 leading-relaxed">
                Fokus pada peningkatan kompetensi organisasi dan program yang memberikan nilai tambah konkret bagi anggota.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl border border-accent-100">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Hasil Nyata</h3>
              <p className="text-secondary-600 leading-relaxed">
                Berkembang dari 11 pendiri menjadi organisasi tiga generasi dengan struktur yang solid dan program yang berkelanjutan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SejarahPage;