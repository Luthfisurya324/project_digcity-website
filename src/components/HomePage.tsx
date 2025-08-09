import React from 'react';
import innovationSvg from '../assets/digital-innovation.svg';
import { ArrowRight, Rocket, Users, Trophy, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-primary-400 to-secondary-400" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-secondary-300 to-primary-300" />
          {/* Grid pattern (kept as SVG background vector) */}
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
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-sm mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  Digital Business Student Society
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900">
                  DIGCITY
                </h1>
                <p className="mt-4 text-lg md:text-xl text-secondary-700">
                  Himpunan Mahasiswa Bisnis Digital — Universitas Ibn Khaldun Bogor
                </p>
                <p className="mt-4 text-base text-secondary-600 max-w-2xl md:max-w-none">
                  Kolaborasi, inovasi, dan prestasi dalam ekosistem bisnis digital untuk mencetak talenta siap industri.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <button className="group inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors">
                    Bergabung Dengan Kami
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a href="#tentang" className="inline-flex items-center justify-center bg-white text-secondary-800 px-6 py-3 rounded-lg font-semibold border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    Pelajari Lebih Lanjut
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center md:justify-end">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary-200 via-secondary-200 to-white rounded-3xl blur-2xl opacity-70" />
                <div className="relative bg-white/80 backdrop-blur border border-secondary-200 rounded-3xl p-6 md:p-8 shadow-xl">
                  <img src={innovationSvg} alt="Digital Innovation" className="w-56 md:w-72" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">Tentang DIGCITY</h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">Himpunan mahasiswa yang berfokus pada pengembangan bisnis digital dan kewirausahaan mahasiswa</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Inovasi</h3>
              <p className="text-secondary-600">Mengembangkan ide-ide kreatif dalam bidang bisnis digital</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>

            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Kolaborasi</h3>
              <p className="text-secondary-600">Membangun jaringan dan kerjasama antar mahasiswa</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>

            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Prestasi</h3>
              <p className="text-secondary-600">Meraih pencapaian terbaik dalam bidang akademik dan non-akademik</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-20 bg-secondary-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative">
              <Target className="absolute -top-6 -left-6 w-16 h-16 text-primary-200/30" />
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Visi</h2>
              <p className="text-lg text-secondary-700 leading-relaxed">
                Menjadi organisasi kemahasiswaan terdepan dalam pengembangan bisnis digital yang menghasilkan lulusan yang kompeten, inovatif, dan berjiwa entrepreneur di era digital.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Misi</h2>
              <ul className="space-y-4 text-lg text-secondary-700">
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Mengembangkan kompetensi mahasiswa dalam bidang bisnis digital
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Memfasilitasi pengembangan soft skill dan hard skill mahasiswa
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Membangun jaringan kerjasama dengan industri dan stakeholder
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Menciptakan wadah kreativitas dan inovasi mahasiswa
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">Pencapaian Kami</h2>
            <p className="text-secondary-600">Angka-angka yang mencerminkan dedikasi dan kolaborasi kami.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">150+</div>
              <div className="text-secondary-600">Anggota Aktif</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">25+</div>
              <div className="text-secondary-600">Event Tahunan</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">10+</div>
              <div className="text-secondary-600">Kerjasama Industri</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">5</div>
              <div className="text-secondary-600">Tahun Berdiri</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;