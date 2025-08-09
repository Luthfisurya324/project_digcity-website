import React from 'react';
import { Eye, Zap, RefreshCw, Lightbulb, CheckCircle2, ClipboardList } from 'lucide-react';

const VisiMisiPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-16">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 800 600">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#fade)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              Visi & Misi DIGCITY
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
              Landasan fundamental yang mengarahkan setiap langkah DIGCITY dalam mencapai tujuan organisasi
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary-50">
              <Eye className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-secondary-900 mb-8">Visi</h2>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto border border-primary-100/60">
              <p className="text-2xl font-medium text-secondary-800 leading-relaxed">
                "Mewujudkan DIGCITY sebagai organisasi yang Berdampak, Adaptif, Inovatif, Kompeten, yang menjadi wadah bagi mahasiswa Bisnis Digital untuk mengembangkan potensi diri, berprestasi, serta berkontribusi nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat."
              </p>
            </div>
          </div>

          {/* Vision Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Berdampak</h3>
              <p className="text-secondary-600">Memberikan manfaat nyata bagi mahasiswa, program studi, universitas, dan masyarakat</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 hover:border-secondary-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Adaptif</h3>
              <p className="text-secondary-600">Mampu menyesuaikan diri dengan perubahan zaman dan kebutuhan mahasiswa</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 hover:border-accent-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Inovatif</h3>
              <p className="text-secondary-600">Menjadi pelopor dalam menciptakan program dan kegiatan yang baru dan bermanfaat</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Kompeten</h3>
              <p className="text-secondary-600">Memastikan setiap anggota memiliki pengetahuan dan keterampilan yang mendalam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-secondary-50">
              <ClipboardList className="w-10 h-10 text-secondary-600" />
            </div>
            <h2 className="text-4xl font-bold text-secondary-900 mb-8">Misi</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Memperkuat Budaya Kolaborasi dan Sinergi
                    </h3>
                    <p className="text-secondary-600">
                      Memperkuat budaya kolaborasi dan sinergi antar anggota DIGCITY serta dengan seluruh mahasiswa Bisnis Digital, Himpunan lain, dan seluruh civitas akademik di Universitas Ibn Khaldun Bogor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Menyelenggarakan Program Pengembangan Diri
                    </h3>
                    <p className="text-secondary-600">
                      Menyelenggarakan program pengembangan diri yang komprehensif dan inovatif untuk meningkatkan kompetensi mahasiswa di bidang akademik, non-akademik, dan kewirausahaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Memberikan Kontribusi Pemikiran dan Karya Nyata
                    </h3>
                    <p className="text-secondary-600">
                      Memberikan kontribusi pemikiran dan karya nyata bagi kemajuan program studi, fakultas, universitas, dan masyarakat umum.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      Mengembangkan Sistem Organisasi Berkelanjutan
                    </h3>
                    <p className="text-secondary-600">
                      Mengembangkan sistem organisasi yang transparan, akuntabel, dan berkelanjutan untuk memastikan keberlangsungan dan kemajuan DIGCITY.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Nilai-Nilai DIGCITY
            </h2>
            <p className="text-lg text-secondary-600">
              Prinsip-prinsip yang menjadi pedoman dalam setiap aktivitas organisasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">E</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Etika</h3>
              <p className="text-sm text-secondary-600">Selalu bersikap sopan dan menghormati setiap anggota, menjaga integritas, transparansi, dan kejujuran</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl border border-secondary-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">L</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Loyalitas</h3>
              <p className="text-sm text-secondary-600">Selalu mendahulukan kepentingan himpunan dibandingkan kepentingan pribadi</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">E</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Eksplorasi</h3>
              <p className="text-sm text-secondary-600">Terbuka terhadap ide-ide baru dan siap mempelajari hal-hal di luar zona nyaman</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">G</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Generasi</h3>
              <p className="text-sm text-secondary-600">Mengidentifikasi dan mengembangkan potensi individu anggota untuk regenerasi yang kuat</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Aksi</h3>
              <p className="text-sm text-secondary-600">Pastikan semua ide dan rencana himpunan terealisasi dengan baik</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">N</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Netralisme</h3>
              <p className="text-sm text-secondary-600">Menciptakan suasana kerja yang inklusif tanpa diskriminasi terhadap junior, senior, atau kelompok tertentu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisiPage;