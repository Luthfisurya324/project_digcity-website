import React from 'react';
import { User, Shield, DollarSign, Users, Camera } from 'lucide-react';

const StrukturOrganisasiPage: React.FC = () => {
  const organizationStructure = [
    {
      level: 'BPH (Executive Committee)',
      positions: [
        { title: 'CEO (Chief Executive Officer)', name: 'Luthfi Surya Saputra', description: 'Pemimpin tertinggi yang bertanggung jawab atas arah strategis dan keputusan utama organisasi' },
        { title: 'COO (Chief Operating Officer)', name: 'TBA', description: 'Fokus pada pengelolaan operasional sehari-hari dan memastikan segala proses berjalan lancar' },
        { title: 'CAO (Chief Administrative Officer)', name: 'TBA', description: 'Mengelola aspek administratif dan kebijakan organisasi' },
        { title: 'CFO (Chief Financial Officer)', name: 'TBA', description: 'Bertanggung jawab atas manajemen keuangan, perencanaan anggaran, dan laporan keuangan' }
      ]
    },
    {
      level: 'Kepala Divisi',
      positions: [
        { title: 'Head of CMI (Creative Media Information)', name: 'TBA', description: 'Bertanggung jawab untuk merancang dan mengelola seluruh konten kreatif serta informasi yang disebarkan oleh organisasi' },
        { title: 'Head of ECRAV (Economy Creative)', name: 'TBA', description: 'Fokus pada pengembangan program atau proyek yang berhubungan dengan ekonomi kreatif' },
        { title: 'Head of POD (People Organizing and Development)', name: 'TBA', description: 'Bertanggung jawab untuk pengelolaan sumber daya manusia dalam organisasi' },
        { title: 'Head of PR (Public Relation)', name: 'TBA', description: 'Bertanggung jawab untuk menjaga citra organisasi di mata publik' }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Fade effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Struktur Organisasi
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Hierarki kepemimpinan dan pembagian tanggung jawab dalam organisasi DIGCITY
            </p>
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
                        <h4 className="text-lg font-bold text-secondary-900 mb-2">
                          {position.title}
                        </h4>
                        
                        {/* Name */}
                        <p className="text-primary-600 font-semibold mb-3">
                          {position.name}
                        </p>
                        
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
              <p className="text-secondary-600 text-sm">BPH memberikan arahan strategis dan mengambil keputusan utama untuk kemajuan organisasi</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Creative Media</h3>
              <p className="text-secondary-600 text-sm">CMI mengelola konten kreatif dan informasi untuk branding organisasi</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Economy Creative</h3>
              <p className="text-secondary-600 text-sm">ECRAV mengembangkan program ekonomi kreatif dan kewirausahaan</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">People Development</h3>
              <p className="text-secondary-600 text-sm">POD dan PR mengelola SDM dan hubungan masyarakat untuk kemajuan organisasi</p>
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
            Untuk informasi lebih lanjut atau kerjasama, silakan hubungi pengurus DIGCITY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@digcity.org" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300">
              Email Resmi
            </a>
            <a href="https://wa.me/6281234567890" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300">
              WhatsApp
            </a>
            <a href="https://instagram.com/digcity_official" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors duration-300">
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasiPage;