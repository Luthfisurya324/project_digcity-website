import React from 'react';
import innovationSvg from '../assets/digital-innovation.svg';
import { ArrowRight, Lightbulb, RefreshCw, Award, CheckCircle2, Target, Calendar, MessageSquare, Users } from 'lucide-react';

interface HomePageProps {
  onPageChange?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const handleNavigation = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

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
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                  DIGCITY
                </h1>
                <p className="mt-4 text-lg md:text-xl text-secondary-700">
                  Himpunan Mahasiswa Bisnis Digital — Universitas Ibn Khaldun Bogor
                </p>
                <p className="mt-4 text-base text-secondary-600 max-w-2xl md:max-w-none">
                  Berdampak • Adaptif • Inovatif • Kompeten — Temukan berbagai acara dan kegiatan kami, sampaikan kritik & saran untuk kemajuan himpunan.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => handleNavigation('events')}
                    className="group inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Jelajahi Acara Kami
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button 
                    onClick={() => handleNavigation('kontak')}
                    className="inline-flex items-center justify-center bg-white text-secondary-800 px-6 py-3 rounded-lg font-semibold border border-secondary-200 hover:bg-secondary-50 transition-colors"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Kritik & Saran
                  </button>
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

      {/* Events Promotion Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Calendar className="mx-auto h-16 w-16 mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Acara & Kegiatan Terbaru</h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Jangan lewatkan berbagai workshop, seminar, kompetisi, dan acara networking yang kami selenggarakan. Bergabunglah untuk mengembangkan skill dan memperluas jaringan Anda!
            </p>
            <button 
              onClick={() => handleNavigation('events')}
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              Lihat Semua Acara
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">Tentang DIGCITY</h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">Wadah pengembangan potensi mahasiswa Bisnis Digital yang menekankan nilai Berdampak, Adaptif, Inovatif, dan Kompeten.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Berdampak</h3>
              <p className="text-secondary-600">Memberi manfaat nyata bagi mahasiswa, program studi, universitas, dan masyarakat.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>

            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Adaptif</h3>
              <p className="text-secondary-600">Mampu menyesuaikan diri dengan perubahan zaman dan kebutuhan mahasiswa.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>

            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Inovatif</h3>
              <p className="text-secondary-600">Pelopor program dan kegiatan yang baru serta bermanfaat.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" />
            </div>

            <div className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Kompeten</h3>
              <p className="text-secondary-600">Mengembangkan pengetahuan dan keterampilan yang mendalam serta aplikatif.</p>
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
                Mewujudkan DIGCITY sebagai organisasi yang Berdampak, Adaptif, Inovatif, Kompeten, yang menjadi wadah bagi mahasiswa Bisnis Digital untuk mengembangkan potensi diri, berprestasi, serta berkontribusi nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Misi</h2>
              <ul className="space-y-4 text-lg text-secondary-700">
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Memperkuat budaya kolaborasi dan sinergi antar anggota DIGCITY serta dengan seluruh mahasiswa Bisnis Digital, Himpunan lain, dan seluruh civitas akademik di Universitas Ibn Khaldun Bogor.
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Menyelenggarakan program pengembangan diri yang komprehensif dan inovatif untuk meningkatkan kompetensi mahasiswa di bidang akademik, non-akademik, dan kewirausahaan.
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Memberikan kontribusi pemikiran dan karya nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat umum.
                </li>
                <li className="flex items-start">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                  Mengembangkan sistem organisasi yang transparan, akuntabel, dan berkelanjutan.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Registration Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-3xl p-8 md:p-12 text-center">
            <Users className="mx-auto h-16 w-16 text-primary-600 mb-6" />
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Bergabung dengan DIGCITY</h2>
            <p className="text-lg text-secondary-700 mb-6 max-w-3xl mx-auto">
              Pendaftaran keanggotaan DIGCITY dibuka pada periode tertentu, yakni di awal setiap kepengurusan atau pada kesempatan khusus yang akan diumumkan melalui platform resmi kami.
            </p>
            <div className="bg-primary-100 rounded-2xl p-6 mb-8 border border-primary-200">
              <p className="text-primary-800 font-medium">
                <strong>Catatan Penting:</strong> Ikuti media sosial dan pengumuman resmi kami untuk mendapatkan informasi terkini mengenai jadwal pendaftaran anggota baru.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('kontak')}
                className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Tanyakan Informasi Lebih Lanjut
              </button>
              <button 
                onClick={() => handleNavigation('events')}
                className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                Lihat Acara Mendatang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Organisasi Section */}
      <section className="py-20 bg-secondary-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">Nilai Organisasi DIGCITY</h2>
            <p className="text-secondary-600 max-w-3xl mx-auto">Pondasi perilaku dan budaya kerja yang menjadi arah gerak organisasi.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Etika</h3>
              <p className="text-secondary-600">Menjaga integritas, transparansi, dan kesopanan dalam setiap interaksi serta pengambilan keputusan.</p>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Loyalitas</h3>
              <p className="text-secondary-600">Mendahulukan kepentingan himpunan dibandingkan kepentingan pribadi.</p>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Eksplorasi</h3>
              <p className="text-secondary-600">Terbuka terhadap ide-ide baru dan siap mempelajari hal di luar zona nyaman.</p>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Generasi</h3>
              <p className="text-secondary-600">Mengidentifikasi dan mengembangkan potensi anggota untuk regenerasi yang kuat.</p>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Aksi</h3>
              <p className="text-secondary-600">Memastikan setiap ide dan rencana terealisasi dengan baik.</p>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Netralisme</h3>
              <p className="text-secondary-600">Menciptakan suasana kerja yang inklusif tanpa diskriminasi.</p>
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
              <div className="text-4xl font-extrabold text-primary-600 mb-1">98</div>
              <div className="text-secondary-600">Anggota Aktif</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">15+</div>
              <div className="text-secondary-600">Event</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">5+</div>
              <div className="text-secondary-600">Kolaborasi</div>
            </div>
            <div className="group text-center p-6 rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow">
              <div className="text-4xl font-extrabold text-primary-600 mb-1">3</div>
              <div className="text-secondary-600">Tahun Berdiri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-700 to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-white mb-6 opacity-90" />
          <h2 className="text-3xl font-bold text-white mb-4">Suara Anda Berharga</h2>
          <p className="text-xl text-secondary-200 mb-8 max-w-3xl mx-auto">
            Sampaikan kritik, saran, atau pertanyaan Anda kepada kami. Masukan dari mahasiswa sangat berarti untuk kemajuan DIGCITY dan program-program yang lebih baik.
          </p>
          <button 
            onClick={() => handleNavigation('kontak')}
            className="inline-flex items-center justify-center bg-white text-secondary-800 px-8 py-4 rounded-lg font-semibold hover:bg-secondary-50 transition-colors shadow-lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Kirim Kritik & Saran
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;