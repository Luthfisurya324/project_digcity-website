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
      href: "https://digcity.my.id",
      title: "Website Utama DigCity",
      description: "Kunjungi website resmi kami",
      icon: "Globe",
      variant: "primary",
      isExternal: true,
      isActive: true,
      order: 1
    },
    {
      id: "dbasic",
      href: "https://instagram.com/dbasic.official",
      title: "D'Basic - Acara Lomba Start-up & Video Kreatif",
      description: "Lomba Start-up dan lomba video kreatif",
      icon: "Instagram",
      variant: "primary",
      isExternal: true,
      isActive: true,
      order: 2
    },
    {
      id: "sob",
      href: "https://instagram.com/sob.corner",
      title: "SOB - Stall Of Business",
      description: "Container jualan dari himpunan mahasiswa bisnis digital (DIGCITY)",
      icon: "Instagram",
      variant: "secondary",
      isExternal: true,
      isActive: true,
      order: 3
    },
    {
      id: "digitalk",
      href: "https://instagram.com/digitalk.show",
      title: "DIGITALK - Talkshow Bisnis",
      description: "Acara Talkshow tentang bisnis",
      icon: "Instagram",
      variant: "accent",
      isExternal: true,
      isActive: true,
      order: 4
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
      platform: "instagram",
      value: "@dbasic.official",
      href: "https://instagram.com/dbasic.official",
      isActive: true
    },
    {
      platform: "instagram",
      value: "@sob.corner",
      href: "https://instagram.com/sob.corner",
      isActive: true
    },
    {
      platform: "instagram",
      value: "@digitalk.show",
      href: "https://instagram.com/digitalk.show",
      isActive: true
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
      platform: "phone",
      value: "+62 812-3456-7890",
      isActive: true
    },
    {
      platform: "location",
      value: "Universitas Ibn Khaldun Bogor",
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
    description: "Temukan semua link penting DIGCITY dalam satu tempat. Website utama, D'Basic, SOB, dan DIGITALK.",
    keywords: ["DIGCITY", "Bisnis Digital", "Himpunan Mahasiswa", "Universitas Ibn Khaldun Bogor", "D'Basic", "SOB", "DIGITALK", "Indonesia"],
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
