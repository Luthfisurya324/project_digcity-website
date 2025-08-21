import React, { useCallback } from 'react';
import { ArrowRight, Lightbulb, RefreshCw, Award, CheckCircle2, Target, Calendar, MessageSquare, Users } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface HomePageProps {
  onPageChange?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const handleNavigation = useCallback((page: string) => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [onPageChange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-primary-400 to-secondary-400" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-secondary-300 to-primary-300" />
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-24">
            <div className="hero-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-xs sm:text-sm mb-3 sm:mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="hidden xs:inline">Digital Business Student Society</span>
                  <span className="xs:hidden">DBSS</span>
                </div>
                <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-secondary-900 mb-4 sm:mb-6 leading-tight">
                  DIGCITY
                </h1>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-secondary-700 leading-relaxed">
                  Himpunan Mahasiswa Bisnis Digital — Universitas Ibn Khaldun Bogor
                </p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-secondary-600 max-w-2xl md:max-w-none leading-relaxed">
                  Berdampak • Adaptif • Inovatif • Kompeten — Temukan berbagai acara dan kegiatan kami, sampaikan kritik & saran untuk kemajuan himpunan.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => handleNavigation('events')}
                    className="group inline-flex items-center justify-center bg-primary-600 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-semibold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                    aria-label="Jelajahi acara dan kegiatan DIGCITY"
                  >
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span className="hidden xs:inline">Jelajahi Acara Kami</span>
                    <span className="xs:hidden">Acara Kami</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                  <button 
                    onClick={() => handleNavigation('kontak')}
                    className="inline-flex items-center justify-center bg-white text-secondary-800 px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-semibold border border-secondary-200 hover:bg-secondary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                    aria-label="Kirim kritik dan saran untuk DIGCITY"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Kritik & Saran
                  </button>
                </div>
              </div>

              <div className="hero-image-container relative flex items-center justify-center justify-self-center md:justify-self-end">
                <img 
                  src="/digital-innovation.png" 
                  alt="Ilustrasi inovasi digital - representasi visi DIGCITY dalam mengembangkan bisnis digital" 
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 mix-blend-multiply"
                  loading="eager"
                  decoding="sync"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Promotion Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700" aria-labelledby="events-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center text-white">
            <Calendar className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 opacity-90" aria-hidden="true" />
            <h2 id="events-heading" className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">Acara & Kegiatan Terbaru</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Jangan lewatkan berbagai workshop, seminar, kompetisi, dan acara networking yang kami selenggarakan. Bergabunglah untuk mengembangkan skill dan memperluas jaringan Anda!
            </p>
            <button 
              onClick={() => handleNavigation('events')}
              className="inline-flex items-center justify-center bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 interactive-element min-h-[44px] text-sm sm:text-base"
              aria-label="Lihat semua acara dan kegiatan DIGCITY"
            >
              <span className="hidden xs:inline">Lihat Semua Acara</span>
              <span className="xs:hidden">Lihat Acara</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-16 sm:py-20 bg-white" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 id="about-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-3 leading-tight">Tentang DIGCITY</h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">Wadah pengembangan potensi mahasiswa Bisnis Digital yang menekankan nilai Berdampak, Adaptif, Inovatif, dan Kompeten.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8" role="list">
            <article className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all" role="listitem">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600" aria-hidden="true">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Berdampak</h3>
              <p className="text-secondary-600">Memberi manfaat nyata bagi mahasiswa, program studi, universitas, dan masyarakat.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" aria-hidden="true" />
            </article>

            <article className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all" role="listitem">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600" aria-hidden="true">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Adaptif</h3>
              <p className="text-secondary-600">Mampu menyesuaikan diri dengan perubahan zaman dan kebutuhan mahasiswa.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" aria-hidden="true" />
            </article>

            <article className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all" role="listitem">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600" aria-hidden="true">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Inovatif</h3>
              <p className="text-secondary-600">Pelopor program dan kegiatan yang baru serta bermanfaat.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" aria-hidden="true" />
            </article>

            <article className="group relative p-6 rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur hover:shadow-xl hover:-translate-y-0.5 transition-all" role="listitem">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600" aria-hidden="true">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Kompeten</h3>
              <p className="text-secondary-600">Mengembangkan pengetahuan dan keterampilan yang mendalam serta aplikatif.</p>
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-secondary-100 to-primary-100" aria-hidden="true" />
            </article>
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-16 sm:py-20 bg-secondary-50/60" aria-labelledby="vision-mission-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="relative">
              <Target className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 text-primary-200/30" aria-hidden="true" />
              <h2 id="vision-mission-heading" className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight">Visi</h2>
              <p className="text-base sm:text-lg text-secondary-700 leading-relaxed">
                Mewujudkan DIGCITY sebagai organisasi yang Berdampak, Adaptif, Inovatif, Kompeten, yang menjadi wadah bagi mahasiswa Bisnis Digital untuk mengembangkan potensi diri, berprestasi, serta berkontribusi nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight">Misi</h2>
              <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-secondary-700" role="list">
                <li className="flex items-start" role="listitem">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-2.5 sm:mt-3 mr-3 flex-shrink-0" aria-hidden="true"></span>
                  <span className="leading-relaxed">Memperkuat budaya kolaborasi dan sinergi antar anggota DIGCITY serta dengan seluruh mahasiswa Bisnis Digital, Himpunan lain, dan seluruh civitas akademik di Universitas Ibn Khaldun Bogor.</span>
                </li>
                <li className="flex items-start" role="listitem">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-2.5 sm:mt-3 mr-3 flex-shrink-0" aria-hidden="true"></span>
                  <span className="leading-relaxed">Menyelenggarakan program pengembangan diri yang komprehensif dan inovatif untuk meningkatkan kompetensi mahasiswa di bidang akademik, non-akademik, dan kewirausahaan.</span>
                </li>
                <li className="flex items-start" role="listitem">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-2.5 sm:mt-3 mr-3 flex-shrink-0" aria-hidden="true"></span>
                  <span className="leading-relaxed">Memberikan kontribusi pemikiran dan karya nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat umum.</span>
                </li>
                <li className="flex items-start" role="listitem">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-2.5 sm:mt-3 mr-3 flex-shrink-0" aria-hidden="true"></span>
                  <span className="leading-relaxed">Mengembangkan sistem organisasi yang transparan, akuntabel, dan berkelanjutan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Registration Info */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="membership-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center">
            <Users className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mb-4 sm:mb-6" aria-hidden="true" />
            <h2 id="membership-heading" className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4 leading-tight">Bergabung dengan DIGCITY</h2>
            <p className="text-base sm:text-lg text-secondary-700 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Pendaftaran keanggotaan DIGCITY dibuka pada periode tertentu, yakni di awal setiap kepengurusan atau pada kesempatan khusus yang akan diumumkan melalui platform resmi kami.
            </p>
            <div className="bg-primary-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary-200">
              <p className="text-sm sm:text-base text-primary-800 font-medium leading-relaxed">
                <strong>Catatan Penting:</strong> Ikuti media sosial dan pengumuman resmi kami untuk mendapatkan informasi terkini mengenai jadwal pendaftaran anggota baru.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('kontak')}
                className="inline-flex items-center justify-center bg-primary-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                aria-label="Tanyakan informasi lebih lanjut tentang keanggotaan DIGCITY"
              >
                <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="hidden xs:inline">Tanyakan Informasi Lebih Lanjut</span>
                <span className="xs:hidden">Tanya Info</span>
              </button>
              <button 
                onClick={() => handleNavigation('events')}
                className="inline-flex items-center justify-center bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-lg font-semibold border border-primary-200 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                aria-label="Lihat acara mendatang DIGCITY"
              >
                <span className="hidden xs:inline">Lihat Acara Mendatang</span>
                <span className="xs:hidden">Lihat Acara</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Organisasi Section */}
      <section className="py-16 sm:py-20 bg-secondary-50/40" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="values-heading" className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 leading-tight">Nilai Organisasi DIGCITY</h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">Pondasi perilaku dan budaya kerja yang menjadi arah gerak organisasi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8" role="list">
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Etika</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Menjaga integritas, transparansi, dan kesopanan dalam setiap interaksi serta pengambilan keputusan.</p>
            </article>
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Loyalitas</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Mendahulukan kepentingan himpunan dibandingkan kepentingan pribadi.</p>
            </article>
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Eksplorasi</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Terbuka terhadap ide-ide baru dan siap mempelajari hal di luar zona nyaman.</p>
            </article>
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Generasi</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Mengidentifikasi dan mengembangkan potensi anggota untuk regenerasi yang kuat.</p>
            </article>
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Aksi</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Memastikan setiap ide dan rencana terealisasi dengan baik.</p>
            </article>
            <article className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white/70 backdrop-blur" role="listitem">
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 leading-tight">Netralisme</h3>
              <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">Menciptakan suasana kerja yang inklusif tanpa diskriminasi.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 leading-tight">Pencapaian Kami</h2>
            <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">Angka-angka yang mencerminkan dedikasi dan kolaborasi kami.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8" role="list">
            <article className="group text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow" role="listitem">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-600 mb-1">98</div>
              <div className="text-sm sm:text-base text-secondary-600">Anggota Aktif</div>
            </article>
            <article className="group text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow" role="listitem">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-600 mb-1">15+</div>
              <div className="text-sm sm:text-base text-secondary-600">Event</div>
            </article>
            <article className="group text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow" role="listitem">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-600 mb-1">5+</div>
              <div className="text-sm sm:text-base text-secondary-600">Kolaborasi</div>
            </article>
            <article className="group text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-200 bg-white hover:shadow-lg transition-shadow" role="listitem">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary-600 mb-1">3</div>
              <div className="text-sm sm:text-base text-secondary-600">Tahun Berdiri</div>
            </article>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-secondary-700 to-secondary-800" aria-labelledby="contact-cta-heading">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-white mb-4 sm:mb-6 opacity-90" aria-hidden="true" />
          <h2 id="contact-cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">Suara Anda Berharga</h2>
          <p className="text-base sm:text-lg md:text-xl text-secondary-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Sampaikan kritik, saran, atau pertanyaan Anda kepada kami. Masukan dari mahasiswa sangat berarti untuk kemajuan DIGCITY dan program-program yang lebih baik.
          </p>
          <button 
            onClick={() => handleNavigation('kontak')}
            className="inline-flex items-center justify-center bg-white text-secondary-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-secondary-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary-700 interactive-element min-h-[44px] text-sm sm:text-base"
            aria-label="Kirim kritik dan saran untuk DIGCITY"
          >
            <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="hidden xs:inline">Kirim Kritik & Saran</span>
            <span className="xs:hidden">Kritik & Saran</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;