import React from 'react';

const LogoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Logo DIGCITY
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Identitas visual yang merepresentasikan semangat inovasi dan kolaborasi dalam bisnis digital
            </p>
          </div>
        </div>
      </section>

      {/* Logo Display Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <img 
                src="/logo_digcity.png" 
                alt="DIGCITY Logo" 
                className="w-64 h-64 object-contain mx-auto mb-8"
              />
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                DIGCITY
              </h2>
              <p className="text-lg text-secondary-600">
                Digital Business Student Society
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Meaning Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Filosofi Logo
            </h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Setiap elemen dalam logo DIGCITY memiliki makna dan filosofi yang mendalam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-50 rounded-xl p-8">
                <img 
                  src="/logo_digcity.png" 
                  alt="DIGCITY Logo" 
                  className="w-48 h-48 object-contain mx-auto"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Warna Orange</h3>
                  <p className="text-secondary-600">
                    Melambangkan semangat, kreativitas, dan energi dalam berinovasi. Warna ini merepresentasikan passion mahasiswa dalam mengembangkan bisnis digital.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Warna Biru</h3>
                  <p className="text-secondary-600">
                    Melambangkan kepercayaan, profesionalisme, dan stabilitas. Menunjukkan komitmen DIGCITY dalam membangun fondasi yang kuat untuk masa depan.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Bentuk Geometris</h3>
                  <p className="text-secondary-600">
                    Bentuk yang dinamis dan modern mencerminkan adaptabilitas dan kemampuan untuk berkembang mengikuti perkembangan teknologi digital.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Tipografi</h3>
                  <p className="text-secondary-600">
                    Font yang clean dan modern menunjukkan profesionalisme dan kemudahan dalam komunikasi, sesuai dengan nilai-nilai organisasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Usage Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Panduan Penggunaan Logo
            </h2>
            <p className="text-lg text-secondary-600">
              Pedoman untuk memastikan konsistensi identitas visual DIGCITY
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Yang Boleh Dilakukan</h3>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>• Gunakan logo dalam ukuran yang proporsional</li>
                <li>• Pastikan kontras yang cukup dengan background</li>
                <li>• Gunakan format file yang berkualitas tinggi</li>
                <li>• Berikan ruang kosong yang cukup di sekitar logo</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Yang Tidak Boleh Dilakukan</h3>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>• Mengubah warna atau bentuk logo</li>
                <li>• Memutar atau membalik logo</li>
                <li>• Menambahkan efek atau filter</li>
                <li>• Menggunakan logo dengan resolusi rendah</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Ukuran Minimum</h3>
              <ul className="text-sm text-secondary-600 space-y-1">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Download Logo
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Unduh logo DIGCITY dalam berbagai format untuk kebutuhan Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
                Download PNG
              </button>
              <button className="bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200">
                Download SVG
              </button>
              <button className="bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogoPage;