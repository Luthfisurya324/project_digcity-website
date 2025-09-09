import React from 'react';
import { Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { OptimizedLogo } from '../ui/OptimizedImage';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <section className="md:col-span-2" aria-labelledby="footer-about">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <OptimizedLogo 
                  src="/logo_digcity.png" 
                  alt="Logo DIGCITY - Himpunan Mahasiswa Bisnis Digital UIKA Bogor" 
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h3 id="footer-about" className="text-xl font-bold">DIGCITY</h3>
                <p className="text-sm text-secondary-300">Digital Business Student Society</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-4 max-w-md">
              Himpunan mahasiswa yang berfokus pada pengembangan kompetensi bisnis digital serta kewirausahaan di Universitas Ibn Khaldun Bogor.
            </p>
            <div className="flex space-x-4" role="list" aria-label="Media sosial DIGCITY">
              <a 
                href="https://instagram.com/digcity_uika" 
                className="text-secondary-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded" 
                aria-label="Ikuti DIGCITY di Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6" aria-hidden="true" />
              </a>
              <a 
                href="https://youtube.com/@digcity_uika" 
                className="text-secondary-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded" 
                aria-label="Tonton video DIGCITY di YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-6 h-6" aria-hidden="true" />
              </a>
              <a 
                href="https://digcity.my.id" 
                className="text-secondary-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded" 
                aria-label="Kunjungi website resmi DIGCITY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Quick Links */}
          <nav aria-labelledby="footer-navigation">
            <h4 id="footer-navigation" className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2" role="list">
              <li>
                <a 
                  href="/sejarah" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  Sejarah
                </a>
              </li>
              <li>
                <a 
                  href="/visi-misi" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  Visi & Misi
                </a>
              </li>
              <li>
                <a 
                  href="/struktur-organisasi" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  Struktur Organisasi
                </a>
              </li>
              <li>
                <a 
                  href="/events" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  Acara & Kegiatan
                </a>
              </li>
              <li>
                <a 
                  href="/galeri" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  Galeri
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <section aria-labelledby="footer-contact">
            <h4 id="footer-contact" className="text-lg font-semibold mb-4">Kontak</h4>
            <address className="space-y-3 not-italic">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-secondary-300 text-sm">
                  <span className="sr-only">Alamat: </span>
                  Sekretariat Ormawa FEB<br />
                  Jl. Sholeh Iskandar No.Km.02<br />
                  Kedungbadak, Tanah Sereal<br />
                  Kota Bogor, Jawa Barat 16162
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:info@digcity.my.id" 
                  className="text-secondary-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                >
                  <span className="sr-only">Email: </span>
                  info@digcity.my.id
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="https://wa.me/6285156773573" 
                  className="text-secondary-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">WhatsApp: </span>
                  +62 851-5677-3573
                </a>
              </div>
            </address>
          </section>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-secondary-400 text-sm">
                © 2025 DIGCITY — Digital Business Student Society
              </p>
              <p className="text-secondary-500 text-xs mt-1">
                Universitas Ibn Khaldun Bogor • Fakultas Ekonomi dan Bisnis
              </p>
            </div>
            <nav className="flex space-x-6 mt-4 md:mt-0" aria-label="Kebijakan dan syarat">
              <a 
                href="/kontak" 
                className="text-secondary-400 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
              >
                Hubungi Kami
              </a>
              <a 
                href="https://digcity.my.id" 
                className="text-secondary-400 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website Resmi
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;