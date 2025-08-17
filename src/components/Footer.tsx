import React from 'react';
import { Twitter, Instagram, Github, Camera, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/logo_digcity.png" 
                  alt="DIGCITY Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">DIGCITY</h3>
                <p className="text-sm text-secondary-300">Digital Business Student Society</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-4 max-w-md">
              Himpunan mahasiswa yang berfokus pada pengembangan kompetensi bisnis digital serta kewirausahaan di Universitas Ibn Khaldun Bogor.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200" aria-label="Gallery">
                <Camera className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Visi & Misi
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Struktur Organisasi
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Bergabung
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">
                  Universitas Ibn Khaldun Bogor<br />
                  Jl. KH. Sholeh Iskandar, Kota Bogor
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">
                  info@digcity.id
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">
                  +62 851-5677-3573
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2025 DIGCITY — Digital Business Student Society. Hak cipta dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors duration-200">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors duration-200">
                Syarat Layanan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;