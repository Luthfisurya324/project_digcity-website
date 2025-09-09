import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, RefreshCw, Award, CheckCircle2, Target, Calendar, MessageSquare, Users, Building2, Sparkles, Zap, Globe, TrendingUp } from 'lucide-react';
import EventCardCarousel from '../components/ui/EventCardCarousel';

const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 pointer-events-none">
          {/* Enhanced gradient blobs with better positioning - mobile optimized */}
          <div className="absolute -top-16 -left-16 sm:-top-32 sm:-left-32 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary-400 via-secondary-400 to-primary-600" />
          <div className="absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-secondary-300 via-primary-300 to-secondary-500" />
          <div className="absolute top-1/3 -right-8 sm:-right-16 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-10 bg-gradient-to-br from-primary-200 to-secondary-300" />
          
          {/* Enhanced grid pattern - mobile optimized */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse" className="sm:w-40 sm:h-40">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-secondary-400" />
          </svg>
          
          {/* Floating geometric shapes - mobile optimized */}
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 border-2 border-primary-200/30 rounded-lg rotate-12 animate-pulse" />
          <div className="absolute bottom-16 left-16 sm:bottom-32 sm:left-32 w-6 h-6 sm:w-12 sm:h-12 bg-secondary-200/20 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-10 sm:left-20 w-4 h-4 sm:w-8 sm:h-8 bg-primary-300/20 rounded-lg rotate-45 animate-pulse delay-500" />
          
          {/* Additional floating elements for more visual interest - mobile optimized */}
          <div className="absolute top-8 left-1/4 sm:top-16 sm:left-1/4 w-3 h-3 sm:w-6 sm:h-6 bg-gradient-to-br from-primary-300/40 to-secondary-300/40 rounded-full animate-bounce delay-700" />
          <div className="absolute bottom-8 right-1/4 sm:bottom-16 sm:right-1/4 w-2 h-2 sm:w-4 sm:h-4 bg-gradient-to-br from-secondary-400/30 to-primary-400/30 rounded-full animate-bounce delay-300" />
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 backdrop-blur border border-secondary-200 text-secondary-700 text-xs sm:text-sm mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500" />
                  <span className="hidden xs:inline">Digital Business Student Society</span>
                  <span className="xs:hidden">DIGCITY Society</span>
                </div>
                <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-secondary-900 mb-4 sm:mb-6">
                  DIGCITY
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-secondary-700 mb-3 sm:mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Himpunan Mahasiswa Bisnis Digital — Universitas Ibn Khaldun Bogor
                </p>
                <p className="text-sm sm:text-base md:text-lg text-secondary-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Berdampak • Adaptif • Inovatif • Kompeten — Temukan berbagai acara dan kegiatan kami, sampaikan kritik & saran untuk kemajuan himpunan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/events"
                    className="group inline-flex items-center justify-center bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[40px] sm:min-h-[44px] text-sm sm:text-base hover:shadow-xl hover:-translate-y-0.5"
                    aria-label="Jelajahi acara dan kegiatan DIGCITY"
                  >
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span className="hidden xs:inline">Jelajahi Acara Kami</span>
                    <span className="xs:hidden">Lihat Acara</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link 
                    to="/kontak"
                    className="inline-flex items-center justify-center bg-white text-secondary-800 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold border border-secondary-200 hover:bg-secondary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[40px] sm:min-h-[44px] text-sm sm:text-base hover:shadow-lg hover:-translate-y-0.5"
                    aria-label="Kirim kritik dan saran untuk DIGCITY"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span className="hidden xs:inline">Kritik & Saran</span>
                    <span className="xs:hidden">Kontak</span>
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-center order-1 lg:order-2 mb-6 lg:mb-0">
                {/* Hidden on mobile, visible on sm and up */}
                <div className="hidden sm:block relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                  {/* Modern visual elements instead of image - mobile optimized */}
                  <div className="relative w-full aspect-square max-w-sm sm:max-w-md lg:max-w-lg">
                    {/* Main circular container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 rounded-full shadow-xl sm:shadow-2xl flex items-center justify-center hover:shadow-3xl transition-shadow duration-300">
                      {/* Inner content - simplified and eye-catching */}
                      <div className="text-center p-4 sm:p-6 lg:p-8">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg hover:scale-105 transition-transform duration-200">
                          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-800 mb-2">DIGCITY</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full mx-auto"></div>
                      </div>
                    </div>
                    
                    {/* Floating icons around the circle - mobile optimized */}
                    <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary-100 hover:scale-110 transition-transform duration-200">
                      <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary-500" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-7 h-7 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-secondary-100 hover:scale-110 transition-transform duration-200">
                      <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-secondary-500" />
                    </div>
                    <div className="absolute top-1/2 -left-4 sm:-left-6 lg:-left-8 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary-200 hover:scale-110 transition-transform duration-200">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-primary-400" />
                    </div>
                    <div className="absolute top-1/4 -right-3 sm:-right-4 lg:-right-6 w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-secondary-200 hover:scale-110 transition-transform duration-200">
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 text-secondary-400" />
                    </div>
                    
                    {/* Decorative dots - mobile optimized */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-primary-300 rounded-full animate-pulse" />
                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2 lg:h-2 bg-secondary-300 rounded-full animate-pulse delay-1000" />
                    <div className="absolute top-1/2 right-2 sm:right-3 lg:right-4 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary-400 rounded-full animate-pulse delay-500" />
                  </div>
                  
                  {/* Background decorative elements */}
                  <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-full blur-3xl scale-150" />
                </div>
                
                {/* Mobile placeholder - simple and clean */}
                <div className="sm:hidden w-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-lg">
                    <Building2 className="w-12 h-12 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Carousel Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-secondary-50/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <EventCardCarousel 
            maxEvents={6}
            showTitle={true}
            autoRefresh={true}
            autoPlayInterval={4000}
            showControls={true}
            className=""
          />
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
              <Link 
                to="/kontak"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                aria-label="Tanyakan informasi lebih lanjut tentang keanggotaan DIGCITY"
              >
                <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="hidden xs:inline">Tanyakan Informasi Lebih Lanjut</span>
                <span className="xs:hidden">Tanya Info</span>
              </Link>
              <Link 
                to="/events"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-lg font-semibold border border-primary-200 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element min-h-[44px] text-sm sm:text-base"
                aria-label="Lihat acara mendatang DIGCITY"
              >
                <span className="hidden xs:inline">Lihat Acara Mendatang</span>
                <span className="xs:hidden">Lihat Acara</span>
              </Link>
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
          <Link 
            to="/kontak"
            className="inline-flex items-center justify-center bg-white text-secondary-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-secondary-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary-700 interactive-element min-h-[44px] text-sm sm:text-base"
            aria-label="Kirim kritik dan saran untuk DIGCITY"
          >
            <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="hidden xs:inline">Kirim Kritik & Saran</span>
            <span className="xs:hidden">Kritik & Saran</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;