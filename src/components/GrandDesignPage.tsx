import React from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

const GrandDesignPage: React.FC = () => {
  const strategicPillars = [
    {
      title: 'Pengembangan SDM',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      description: 'Mengembangkan kompetensi dan kapasitas anggota melalui program pelatihan berkelanjutan',
      initiatives: [
        'Level Up Day - Program pelatihan skill',
        'Workshop teknologi dan bisnis digital',
        'Mentoring dan coaching anggota',
        'Program sertifikasi profesional'
      ]
    },
    {
      title: 'Inovasi Teknologi',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: 'Mengembangkan dan mengimplementasikan solusi teknologi inovatif untuk kemajuan organisasi',
      initiatives: [
        'Pengembangan platform digital DIGCITY',
        'Sistem manajemen organisasi terintegrasi',
        'Inovasi produk dan layanan digital',
        'Research & development teknologi terbaru'
      ]
    },
    {
      title: 'Kemitraan Strategis',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Membangun jaringan kerjasama strategis dengan berbagai stakeholder internal dan eksternal',
      initiatives: [
        'Kerjasama dengan industri dan startup',
        'Partnership dengan organisasi mahasiswa lain',
        'Kolaborasi dengan alumni dan mentor',
        'Networking dengan komunitas digital'
      ]
    },
    {
      title: 'Keberlanjutan Organisasi',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      description: 'Memastikan keberlangsungan dan pertumbuhan organisasi melalui sistem yang berkelanjutan',
      initiatives: [
        'Sistem regenerasi kepemimpinan yang efektif',
        'Diversifikasi sumber pendanaan organisasi',
        'Knowledge management dan dokumentasi',
        'Continuous improvement dan evaluasi'
      ]
    }
  ];

  const roadmapPhases = [
    {
      phase: 'Periode 2024/2025: Foundation & Growth',
      color: 'primary',
      goals: [
        'Konsolidasi struktur organisasi BPH dan 4 divisi',
        'Implementasi program unggulan (DIGIMON, Level Up Day)',
        'Pengembangan sistem pelaporan Padlet.com',
        'Penguatan brand identity DIGCITY'
      ]
    },
    {
      phase: 'Jangka Pendek: Program Kerja Utama',
      color: 'secondary',
      goals: [
        'SCBD - Sharing & Caring Business Discussion',
        'Merchandise business dan revenue generation',
        'Workshop teknologi dan skill development',
        'Networking dan partnership building'
      ]
    },
    {
      phase: 'Jangka Menengah: Ekspansi & Inovasi',
      color: 'accent',
      goals: [
        'Pengembangan platform digital terintegrasi',
        'Ekspansi program ke komunitas eksternal',
        'Kemitraan strategis dengan industri',
        'Program inkubator dan mentoring'
      ]
    },
    {
      phase: 'Jangka Panjang: Sustainability & Legacy',
      color: 'green',
      goals: [
        'Ekosistem digital yang berkelanjutan',
        'Alumni network dan career development',
        'Research & innovation center',
        'Thought leadership dalam industri digital'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return { bg: 'bg-primary-500', text: 'text-primary-600', border: 'border-primary-500' };
      case 'secondary':
        return { bg: 'bg-secondary-500', text: 'text-secondary-600', border: 'border-secondary-500' };
      case 'accent':
        return { bg: 'bg-accent-500', text: 'text-accent-600', border: 'border-accent-500' };
      case 'green':
        return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-500' };
    }
  };

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
                <Target className="w-4 h-4 text-primary-500" />
                Strategic Plan
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Grand Design DIGCITY
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Rencana strategis jangka panjang untuk mewujudkan visi DIGCITY sebagai organisasi mahasiswa yang berdampak, adaptif, inovatif, dan kompeten dalam era digital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Gambaran Umum
            </h2>
            <p className="text-lg text-secondary-600 max-w-4xl mx-auto">
              Grand Design DIGCITY 2024/2025 merupakan dokumen strategis yang menguraikan arah pengembangan organisasi untuk menciptakan ekosistem digital yang berkelanjutan. 
              Dokumen ini menjadi panduan dalam mengambil keputusan strategis dan mengalokasikan sumber daya untuk mencapai visi organisasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Visi DIGCITY</h3>
              <p className="text-secondary-600">Menjadi organisasi mahasiswa yang berdampak, adaptif, inovatif, dan kompeten dalam era digital</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">4 Pilar Strategis</h3>
              <p className="text-secondary-600">Fondasi utama pengembangan organisasi menuju keunggulan</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Roadmap Strategis</h3>
              <p className="text-secondary-600">Tahapan implementasi yang terstruktur dan terukur</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Pilar Strategis
            </h2>
            <p className="text-lg text-secondary-600">
              Empat pilar utama yang menjadi fondasi pengembangan DIGCITY
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {strategicPillars.map((pillar, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900">{pillar.title}</h3>
                </div>
                <p className="text-secondary-600 mb-6">{pillar.description}</p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-secondary-900">Inisiatif Utama:</h4>
                  <ul className="space-y-2">
                    {pillar.initiatives.map((initiative, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-secondary-600">{initiative}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Roadmap Implementasi
            </h2>
            <p className="text-lg text-secondary-600">
              Tahapan pelaksanaan Grand Design DIGCITY untuk mencapai visi organisasi
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden lg:block"></div>

            <div className="space-y-12">
              {roadmapPhases.map((phase, index) => {
                const colors = getColorClasses(phase.color);
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colors.border}`}>
                        <h3 className={`text-xl font-bold ${colors.text} mb-4`}>{phase.phase}</h3>
                        <ul className="space-y-2">
                          {phase.goals.map((goal, goalIndex) => (
                            <li key={goalIndex} className="flex items-start">
                              <div className={`w-2 h-2 ${colors.bg} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                              <span className="text-secondary-600">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="hidden lg:flex w-2/12 justify-center">
                      <div className={`w-4 h-4 ${colors.bg} rounded-full border-4 border-white shadow-lg`}></div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Indikator Keberhasilan
            </h2>
            <p className="text-lg text-secondary-600">
              Metrik yang digunakan untuk mengukur pencapaian Grand Design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-secondary-900 font-semibold mb-1">Anggota Aktif</div>
              <div className="text-sm text-secondary-600">Target 2024/2025</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-secondary-600 mb-2">20+</div>
              <div className="text-secondary-900 font-semibold mb-1">Program Unggulan</div>
              <div className="text-sm text-secondary-600">Per periode</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-accent-600 mb-2">15+</div>
              <div className="text-secondary-900 font-semibold mb-1">Kemitraan Strategis</div>
              <div className="text-sm text-secondary-600">Industri & Komunitas</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-secondary-900 font-semibold mb-1">Divisi Utama</div>
              <div className="text-sm text-secondary-600">CMI, ECRAV, POD, PR</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Mari Bersama Mewujudkan Visi DIGCITY
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Grand Design ini hanya dapat terwujud dengan dukungan dan partisipasi aktif dari seluruh anggota dan stakeholder DIGCITY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/GRAND DESIGN DIGCITY 2024-2025_DRAFT 7.pdf" 
              download="GRAND DESIGN DIGCITY 2024-2025_DRAFT 7.pdf"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300 inline-block text-center"
            >
              Download Grand Design
            </a>
            <Link 
              to="/kontak"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300"
            >
              Bergabung dengan Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrandDesignPage;