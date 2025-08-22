import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, DollarSign, Users, Camera } from 'lucide-react';

const StrukturOrganisasiPage: React.FC = () => {
  const organizationStructure = [
    {
      level: 'BPH (Executive Committee)',
      positions: [
        { 
          title: 'CEO (Chief Executive Officer)', 
          description: 'Pemimpin tertinggi yang bertanggung jawab atas arah strategis dan keputusan utama organisasi. Memimpin seluruh kegiatan organisasi dan mengambil keputusan strategis untuk kemajuan DIGCITY.' 
        },
        { 
          title: 'COO (Chief Operating Officer)', 
          description: 'Fokus pada pengelolaan operasional sehari-hari dan memastikan segala proses berjalan lancar. Mengkoordinasikan pelaksanaan program kerja dan memastikan efektivitas operasional organisasi.' 
        },
        { 
          title: 'CAO (Chief Administrative Officer)', 
          description: 'Mengelola aspek administratif dan kebijakan organisasi. Bertanggung jawab atas sistem administrasi, dokumentasi, dan implementasi kebijakan internal organisasi.' 
        },
        { 
          title: 'CFO (Chief Financial Officer)', 
          description: 'Bertanggung jawab atas manajemen keuangan, perencanaan anggaran, dan laporan keuangan. Mengelola keuangan organisasi secara transparan dan akuntabel.' 
        }
      ]
    },
    {
      level: 'Kepala Divisi',
      positions: [
        { 
          title: 'Head of CMI (Creative Media Information)', 
          description: 'Bertanggung jawab untuk merancang dan mengelola seluruh konten kreatif serta informasi yang disebarkan oleh organisasi. Mengelola media sosial, pembuatan konten visual, dan strategi komunikasi digital DIGCITY.' 
        },
        { 
          title: 'Head of ECRAV (Economy Creative)', 
          description: 'Fokus pada pengembangan program atau proyek yang berhubungan dengan ekonomi kreatif. Mengelola bisnis merchandise, program kewirausahaan, dan pengembangan ekonomi kreatif untuk anggota.' 
        },
        { 
          title: 'Head of POD (People Organizing and Development)', 
          description: 'Bertanggung jawab untuk pengelolaan sumber daya manusia dalam organisasi. Mengelola rekrutmen, pengembangan anggota, pelatihan kepemimpinan, dan program pengembangan diri.' 
        },
        { 
          title: 'Head of PR (Public Relation)', 
          description: 'Bertanggung jawab untuk menjaga citra organisasi di mata publik. Mengelola hubungan eksternal, kampanye branding, dan representasi DIGCITY di berbagai event dan kegiatan.' 
        }
      ]
    }
  ];

  const getColorByLevel = (level: string) => {
    switch (level) {
      case 'BPH (Executive Committee)':
        return 'from-primary-500 to-primary-600';
      case 'Kepala Divisi':
        return 'from-secondary-500 to-secondary-600';
      default:
        return 'from-gray-500 to-gray-600';
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
                <Users className="w-4 h-4 text-primary-500" />
                Organization Structure
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Struktur Organisasi
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Hierarki kepemimpinan dan pembagian tanggung jawab dalam organisasi DIGCITY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Bagan Organisasi DIGCITY
            </h2>
            <p className="text-lg text-secondary-600">
              Struktur kepemimpinan yang mendukung visi dan misi organisasi
            </p>
          </div>

          <div className="space-y-12">
            {organizationStructure.map((level, levelIndex) => (
              <div key={levelIndex} className="relative">
                {/* Level Title */}
                <div className="text-center mb-8">
                  <div className={`inline-block bg-gradient-to-r ${getColorByLevel(level.level)} text-white px-6 py-3 rounded-full`}>
                    <h3 className="text-lg font-semibold">{level.level}</h3>
                  </div>
                </div>

                {/* Positions Grid */}
                <div className={`grid gap-6 ${
                  level.positions.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  level.positions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                  level.positions.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {level.positions.map((position, positionIndex) => (
                    <div key={positionIndex} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 border-l-4 border-primary-500 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                      <div className="text-center">
                        {/* Avatar Placeholder */}
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-10 h-10 text-primary-600" />
                        </div>
                        
                        {/* Position Title */}
                        <h4 className="text-lg font-bold text-secondary-900 mb-4">
                          {position.title}
                        </h4>
                        
                        {/* Description */}
                        <p className="text-sm text-secondary-600 leading-relaxed">
                          {position.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connecting Lines (except for last level) */}
                {levelIndex < organizationStructure.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsibilities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Tanggung Jawab Utama
            </h2>
            <p className="text-lg text-secondary-600">
              Pembagian tugas dan tanggung jawab setiap tingkatan dalam organisasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Executive Leadership</h3>
              <p className="text-secondary-600 text-sm">BPH memberikan arahan strategis, mengelola operasional, administrasi, dan keuangan organisasi secara transparan dan akuntabel</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Creative Media Information</h3>
              <p className="text-secondary-600 text-sm">CMI mengelola konten kreatif, media sosial, strategi komunikasi digital, dan branding organisasi</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Economy Creative</h3>
              <p className="text-secondary-600 text-sm">ECRAV mengembangkan bisnis merchandise, program kewirausahaan, dan ekonomi kreatif untuk anggota</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">People & Public Relations</h3>
              <p className="text-secondary-600 text-sm">POD mengelola SDM dan pengembangan anggota, sementara PR menjaga hubungan eksternal dan citra organisasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Hubungi Pengurus
          </h2>
          <p className="text-lg text-secondary-600 mb-8">
            Untuk informasi lebih lanjut atau kerjasama, silakan kunjungi halaman kontak kami
          </p>
          <div className="flex justify-center">
            <Link to="/kontak" className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 text-lg font-semibold interactive-element">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasiPage;