export interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl: string;
  structuredData?: object;
}

const baseUrl = 'https://digcity.my.id';
const defaultImage = '/logo_digcity.png';

export const seoConfig: Record<string, PageSEOConfig> = {
  home: {
    title: 'DIGCITY - Himpunan Mahasiswa Bisnis Digital UIKA Bogor',
    description: 'Website resmi DIGCITY, Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor. Organisasi yang berdampak, adaptif, inovatif, dan kompeten untuk pengembangan potensi mahasiswa.',
    keywords: 'DIGCITY, Himpunan Mahasiswa, Bisnis Digital, UIKA Bogor, Universitas Ibn Khaldun, Organisasi Mahasiswa, Digital Business, Mahasiswa',
    canonicalUrl: baseUrl,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DIGCITY',
      description: 'Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor',
      url: baseUrl,
      logo: `${baseUrl}${defaultImage}`,
      foundingDate: '2024',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bogor',
        addressRegion: 'Jawa Barat',
        addressCountry: 'ID'
      },
      parentOrganization: {
        '@type': 'EducationalOrganization',
        name: 'Universitas Ibn Khaldun Bogor',
        url: 'https://uika-bogor.ac.id'
      },
      sameAs: [
        'https://instagram.com/digcity_uika',
        'https://linkedin.com/company/digcity-uika'
      ]
    }
  },
  
  blog: {
    title: 'Blog - DIGCITY | Artikel dan Berita Terkini',
    description: 'Baca artikel terbaru, berita, dan insight menarik seputar bisnis digital, teknologi, dan kegiatan DIGCITY. Tetap update dengan perkembangan terkini.',
    keywords: 'blog DIGCITY, artikel bisnis digital, berita mahasiswa, teknologi, startup, entrepreneurship, UIKA Bogor',
    canonicalUrl: `${baseUrl}/blog`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog DIGCITY',
      description: 'Blog resmi DIGCITY dengan artikel seputar bisnis digital dan teknologi',
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'DIGCITY',
        logo: `${baseUrl}${defaultImage}`
      },
      blogPost: {
        '@type': 'BlogPosting',
        headline: 'Artikel Terbaru DIGCITY',
        description: 'Koleksi artikel dan berita terbaru dari DIGCITY',
        author: {
          '@type': 'Organization',
          name: 'DIGCITY'
        }
      }
    }
  },
  
  events: {
    title: 'Events - DIGCITY | Acara dan Kegiatan Terbaru',
    description: 'Temukan berbagai acara menarik, workshop, seminar, dan kegiatan DIGCITY. Bergabunglah dengan komunitas bisnis digital terdepan di UIKA Bogor.',
    keywords: 'events DIGCITY, acara mahasiswa, workshop bisnis digital, seminar teknologi, kegiatan UIKA, networking',
    canonicalUrl: `${baseUrl}/events`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'EventSeries',
      name: 'DIGCITY Events',
      description: 'Seri acara dan kegiatan yang diselenggarakan oleh DIGCITY',
      organizer: {
        '@type': 'Organization',
        name: 'DIGCITY',
        url: baseUrl
      }
    }
  },
  
  sejarah: {
    title: 'Sejarah - DIGCITY | Perjalanan dan Milestone Organisasi',
    description: 'Pelajari sejarah berdirinya DIGCITY, milestone penting, dan perjalanan organisasi dalam mengembangkan ekosistem bisnis digital di UIKA Bogor.',
    keywords: 'sejarah DIGCITY, milestone organisasi, perjalanan DIGCITY, founding story, UIKA Bogor history',
    canonicalUrl: `${baseUrl}/sejarah`
  },
  
  logo: {
    title: 'Logo - DIGCITY | Brand Identity dan Panduan Penggunaan',
    description: 'Download logo resmi DIGCITY dan pelajari panduan penggunaan brand identity. Dapatkan aset visual berkualitas tinggi untuk keperluan resmi.',
    keywords: 'logo DIGCITY, brand identity, download logo, panduan brand, aset visual, corporate identity',
    canonicalUrl: `${baseUrl}/logo`
  },
  
  'visi-misi': {
    title: 'Visi Misi - DIGCITY | Tujuan dan Nilai Organisasi',
    description: 'Ketahui visi, misi, dan nilai-nilai yang menjadi fondasi DIGCITY dalam mengembangkan potensi mahasiswa bisnis digital di UIKA Bogor.',
    keywords: 'visi misi DIGCITY, tujuan organisasi, nilai DIGCITY, filosofi organisasi, UIKA Bogor',
    canonicalUrl: `${baseUrl}/visi-misi`
  },
  
  'struktur-organisasi': {
    title: 'Struktur Organisasi - DIGCITY | Kepengurusan dan Tim',
    description: 'Lihat struktur organisasi DIGCITY, profil pengurus, dan tim yang berdedikasi mengembangkan komunitas bisnis digital di UIKA Bogor.',
    keywords: 'struktur organisasi DIGCITY, pengurus DIGCITY, tim DIGCITY, kepengurusan, organizational chart',
    canonicalUrl: `${baseUrl}/struktur-organisasi`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DIGCITY',
      description: 'Struktur organisasi dan kepengurusan DIGCITY',
      url: `${baseUrl}/struktur-organisasi`,
      organizationType: 'Student Organization'
    }
  },
  
  'grand-design': {
    title: 'Grand Design - DIGCITY | Rencana Strategis dan Roadmap',
    description: 'Pelajari grand design DIGCITY, rencana strategis jangka panjang, dan roadmap pengembangan organisasi untuk masa depan yang lebih baik.',
    keywords: 'grand design DIGCITY, rencana strategis, roadmap organisasi, strategic planning, future vision',
    canonicalUrl: `${baseUrl}/grand-design`
  },
  
  galeri: {
    title: 'Galeri - DIGCITY | Dokumentasi Kegiatan dan Momen Berharga',
    description: 'Jelajahi galeri foto dan video dokumentasi kegiatan DIGCITY. Lihat momen-momen berharga dan pencapaian organisasi.',
    keywords: 'galeri DIGCITY, foto kegiatan, dokumentasi acara, video DIGCITY, portfolio kegiatan, memories',
    canonicalUrl: `${baseUrl}/galeri`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: 'Galeri DIGCITY',
      description: 'Koleksi foto dan dokumentasi kegiatan DIGCITY',
      url: `${baseUrl}/galeri`
    }
  },
  
  kontak: {
    title: 'Kontak - DIGCITY | Hubungi Kami',
    description: 'Hubungi DIGCITY untuk informasi lebih lanjut, kerjasama, atau pertanyaan. Temukan berbagai cara untuk terhubung dengan kami.',
    keywords: 'kontak DIGCITY, hubungi kami, contact information, alamat DIGCITY, email DIGCITY, social media',
    canonicalUrl: `${baseUrl}/kontak`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Kontak DIGCITY',
      description: 'Halaman kontak resmi DIGCITY',
      url: `${baseUrl}/kontak`,
      mainEntity: {
        '@type': 'Organization',
        name: 'DIGCITY',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: 'Indonesian'
        }
      }
    }
  },
  
  admin: {
    title: 'Admin Panel - DIGCITY | Dashboard Administrasi',
    description: 'Panel administrasi DIGCITY untuk mengelola konten website, blog, events, dan data organisasi.',
    keywords: 'admin DIGCITY, dashboard, panel administrasi, content management',
    canonicalUrl: `${baseUrl}/admin`
  }
};

export const getSEOConfig = (page: string): PageSEOConfig => {
  return seoConfig[page] || seoConfig.home;
};