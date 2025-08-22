export interface LinktreeLink {
  id: string;
  href: string;
  title: string;
  description?: string;
  icon?: string;
  variant: 'primary' | 'secondary' | 'accent';
  isExternal: boolean;
  isActive: boolean;
  order: number;
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok';
  value: string;
  href: string;
  isActive: boolean;
}

export interface ContactInfo {
  platform: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'location';
  value: string;
  href?: string;
  isActive: boolean;
}

export interface LinktreeConfig {
  title: string;
  subtitle: string;
  avatar: string;
  description: string;
  links: LinktreeLink[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

// Default configuration for DigCity Linktree
export const defaultLinktreeConfig: LinktreeConfig = {
  title: "DIGCITY",
  subtitle: "Himpunan Mahasiswa Bisnis Digital",
  avatar: "/logo_digcity.png",
  description: "Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor yang menekankan nilai Berdampak, Adaptif, Inovatif, dan Kompeten.",
  
  links: [
    {
      id: "website",
      href: "/",
      title: "Website Utama DigCity",
      description: "Kunjungi website resmi kami",
      icon: "Globe",
      variant: "primary",
      isExternal: false,
      isActive: true,
      order: 1
    },
    {
      id: "registration",
      href: "https://forms.google.com/your-form-id",
      title: "Pendaftaran Member Baru",
      description: "Bergabung dengan komunitas DigCity",
      icon: "FileText",
      variant: "accent",
      isExternal: true,
      isActive: true,
      order: 2
    },
    {
      id: "events",
      href: "/events",
      title: "Event & Workshop",
      description: "Lihat event terbaru kami",
      icon: "Calendar",
      variant: "primary",
      isExternal: false,
      isActive: true,
      order: 3
    },
    {
      id: "gallery",
      href: "/galeri",
      title: "Galeri Foto",
      description: "Lihat dokumentasi kegiatan",
      icon: "Image",
      variant: "secondary",
      isExternal: false,
      isActive: true,
      order: 4
    },
    {
      id: "blog",
      href: "/blog",
      title: "Berita & Update",
      description: "Informasi terbaru dari DIGCITY",
      icon: "Newspaper",
      variant: "primary",
      isExternal: false,
      isActive: true,
      order: 5
    },
    {
      id: "contact",
      href: "/kontak",
      title: "Hubungi Kami",
      description: "Kontak dan informasi lengkap",
      icon: "Mail",
      variant: "secondary",
      isExternal: false,
      isActive: true,
      order: 6
    },
    {
      id: "about",
      href: "/visi-misi",
      title: "Visi & Misi",
      description: "Kenali visi dan misi DIGCITY",
      icon: "Target",
      variant: "secondary",
      isExternal: false,
      isActive: true,
      order: 7
    },
    {
      id: "gallery",
      href: "/galeri",
      title: "Galeri Foto",
      description: "Lihat dokumentasi kegiatan",
      icon: "Image",
      variant: "secondary",
      isExternal: false,
      isActive: true,
      order: 8
    }
  ],
  
  socialLinks: [
    {
      platform: "instagram",
      value: "@digcity_official",
      href: "https://instagram.com/digcity_official",
      isActive: true
    },
    {
      platform: "facebook",
      value: "DIGCITY Official",
      href: "https://facebook.com/digcity.official",
      isActive: true
    },
    {
      platform: "twitter",
      value: "@digcity_official",
      href: "https://twitter.com/digcity_official",
      isActive: true
    },
    {
      platform: "youtube",
      value: "DIGCITY Channel",
      href: "https://youtube.com/@digcity",
      isActive: false
    },
    {
      platform: "linkedin",
      value: "DIGCITY",
      href: "https://linkedin.com/company/digcity",
      isActive: false
    },
    {
      platform: "tiktok",
      value: "@digcity_official",
      href: "https://tiktok.com/@digcity_official",
      isActive: false
    }
  ],
  
  contactInfo: [
    {
      platform: "email",
      value: "info@digcity.my.id",
      href: "mailto:info@digcity.my.id",
      isActive: true
    },
    {
      platform: "whatsapp",
      value: "+62 812-3456-7890",
      href: "https://wa.me/6281234567890",
      isActive: true
    },
    {
      platform: "telegram",
      value: "@digcity_support",
      href: "https://t.me/digcity_support",
      isActive: false
    },
    {
      platform: "phone",
      value: "+62 812-3456-7890",
      isActive: true
    },
    {
      platform: "location",
      value: "Jakarta, Indonesia",
      isActive: true
    }
  ],
  
  theme: {
    primaryColor: "#2563eb", // blue-600
    secondaryColor: "#4b5563", // gray-600
    accentColor: "#059669", // green-600
    backgroundColor: "#f8fafc" // slate-50
  },
  
  seo: {
    title: "DIGCITY - Himpunan Mahasiswa Bisnis Digital | Linktree",
    description: "Temukan semua link penting DIGCITY dalam satu tempat. Website, pendaftaran, event, galeri, dan informasi kontak lengkap.",
    keywords: ["DIGCITY", "Bisnis Digital", "Himpunan Mahasiswa", "Universitas Ibn Khaldun Bogor", "Workshop", "Event", "Indonesia"],
    ogImage: "/logo_digcity.png"
  }
};

// Function to get active links only
export const getActiveLinks = (config: LinktreeConfig): LinktreeLink[] => {
  return config.links
    .filter(link => link.isActive)
    .sort((a, b) => a.order - b.order);
};

// Function to get active social links only
export const getActiveSocialLinks = (config: LinktreeConfig): SocialLink[] => {
  return config.socialLinks.filter(link => link.isActive);
};

// Function to get active contact info only
export const getActiveContactInfo = (config: LinktreeConfig): ContactInfo[] => {
  return config.contactInfo.filter(info => info.isActive);
};
