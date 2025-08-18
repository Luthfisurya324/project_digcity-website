import React from 'react';
import { Palette } from 'lucide-react';

const LogoPage: React.FC = () => {
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
                <Palette className="w-4 h-4 text-primary-500" />
                Brand Identity
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Logo DIGCITY
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Identitas visual yang mencerminkan inovasi, teknologi, dan kemajuan digital kota masa depan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Display Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4">
              Logo Utama
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 px-2">
              Logo resmi DIGCITY dalam berbagai variasi
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center">
              <img 
                src="/logo_digcity.png" 
                alt="Logo DIGCITY" 
                className="h-24 sm:h-32 mx-auto mb-3 sm:mb-4"
              />
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Logo Utama</h3>
              <p className="text-sm text-secondary-600 px-2">Untuk penggunaan umum dengan background terang</p>
            </div>

            <div className="bg-secondary-900 rounded-lg p-6 sm:p-8 text-center">
              <img 
                src="/logo_digcity.png" 
                alt="Logo DIGCITY White" 
                className="h-24 sm:h-32 mx-auto mb-3 sm:mb-4 filter brightness-0 invert"
              />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Logo Putih</h3>
              <p className="text-sm text-gray-300 px-2">Untuk penggunaan dengan background gelap</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Meaning Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4">
              Filosofi Logo
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed px-2">
              Setiap elemen dalam logo DIGCITY memiliki makna dan filosofi yang mendalam
            </p>
          </div>

          <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-2 items-center">
            <div>
              <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
                <img 
                  src="/logo_digcity.png" 
                  alt="DIGCITY Logo" 
                  className="w-32 h-32 sm:w-48 sm:h-48 object-contain mx-auto"
                />
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-1 sm:mb-2">Warna Orange</h3>
                  <p className="text-sm sm:text-base text-secondary-600">
                    Melambangkan semangat, kreativitas, dan energi dalam berinovasi. Warna ini merepresentasikan passion mahasiswa dalam mengembangkan bisnis digital.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-1 sm:mb-2">Warna Biru</h3>
                  <p className="text-sm sm:text-base text-secondary-600">
                    Melambangkan kepercayaan, profesionalisme, dan stabilitas. Menunjukkan komitmen DIGCITY dalam membangun fondasi yang kuat untuk masa depan.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-3 h-3 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-1 sm:mb-2">Bentuk Geometris</h3>
                  <p className="text-sm sm:text-base text-secondary-600">
                    Bentuk yang dinamis dan modern mencerminkan adaptabilitas dan kemampuan untuk berkembang mengikuti perkembangan teknologi digital.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-3 h-3 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-1 sm:mb-2">Tipografi</h3>
                  <p className="text-sm sm:text-base text-secondary-600">
                    Font yang clean dan modern menunjukkan profesionalisme dan kemudahan dalam komunikasi, sesuai dengan nilai-nilai organisasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Usage Guidelines */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4">
              Panduan Penggunaan Logo
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 px-2">
              Pedoman untuk memastikan konsistensi identitas visual DIGCITY
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Yang Boleh Dilakukan</h3>
              <ul className="text-xs sm:text-sm text-secondary-600 space-y-1">
                <li>• Gunakan logo dalam ukuran yang proporsional</li>
                <li>• Pastikan kontras yang cukup dengan background</li>
                <li>• Gunakan format file yang berkualitas tinggi</li>
                <li>• Berikan ruang kosong yang cukup di sekitar logo</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Yang Tidak Boleh Dilakukan</h3>
              <ul className="text-xs sm:text-sm text-secondary-600 space-y-1">
                <li>• Mengubah warna atau bentuk logo</li>
                <li>• Memutar atau membalik logo</li>
                <li>• Menambahkan efek atau filter</li>
                <li>• Menggunakan logo dengan resolusi rendah</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-lg md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Ukuran Minimum</h3>
              <ul className="text-xs sm:text-sm text-secondary-600 space-y-1">
                <li>• Digital: 32x32 pixel</li>
                <li>• Print: 15mm x 15mm</li>
                <li>• Pastikan keterbacaan tetap optimal</li>
                <li>• Gunakan versi simplified untuk ukuran kecil</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4">
              Download Logo
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 mb-6 sm:mb-8 px-2">
              Unduh logo DIGCITY dalam berbagai format untuk kebutuhan Anda
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
              <a 
                href="/logo_digcity.png" 
                download="logo_digcity.png"
                className="bg-primary-600 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PNG
              </a>
              <button 
                className="bg-secondary-600 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200 opacity-50 cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                disabled
                title="Format SVG belum tersedia"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download SVG
              </button>
              <button 
                className="bg-accent-600 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200 opacity-50 cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                disabled
                title="Format PDF belum tersedia"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-secondary-500 px-2">
              <p>Format PNG tersedia untuk unduhan. Format SVG dan PDF akan segera tersedia.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogoPage;