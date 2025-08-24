import React from 'react';
import LinktreeLayout from './LinktreeLayout';
import LinktreeButton from './LinktreeButton';
import LinktreeCard from './LinktreeCard';
import { useDomainSEO } from '../../hooks/useDomainSEO';
import { 
  Globe, 
  FileText, 
  Calendar, 
  Image, 
  Newspaper, 
  Mail,
  Target,
  Users,
  Award
} from 'lucide-react';
import { defaultLinktreeConfig, getActiveLinks, getActiveSocialLinks, getActiveContactInfo } from '../../config/linktreeConfig';

const LinktreePage: React.FC = () => {
  // Initialize domain-specific SEO
  useDomainSEO();

  // Icon mapping for dynamic icon rendering
  const IconMap: Record<string, React.ReactNode> = {
    Globe: <Globe size={24} />,
    FileText: <FileText size={24} />,
    Calendar: <Calendar size={24} />,
    Image: <Image size={24} />,
    Newspaper: <Newspaper size={24} />,
    Mail: <Mail size={24} />,
    Target: <Target size={24} />,
    Users: <Users size={24} />,
    Award: <Award size={24} />
  };

  // Get active links from config
  const activeLinks = getActiveLinks(defaultLinktreeConfig);
  const activeSocialLinks = getActiveSocialLinks(defaultLinktreeConfig);
  const activeContactInfo = getActiveContactInfo(defaultLinktreeConfig);

  // Convert config data to component format
  const socialLinks = activeSocialLinks.map(link => ({
    platform: link.platform as 'instagram' | 'facebook' | 'twitter',
    value: link.value,
    href: link.href
  }));

  const contactInfo = activeContactInfo.map(info => ({
    platform: info.platform as 'email' | 'phone' | 'location',
    value: info.value,
    href: info.href
  }));

  return (
    <LinktreeLayout
      title={defaultLinktreeConfig.title}
      subtitle={defaultLinktreeConfig.subtitle}
      avatar={defaultLinktreeConfig.avatar}
    >
      {/* Main Links */}
      {activeLinks.map((link) => (
        <LinktreeButton
          key={link.id}
          href={link.href}
          title={link.title}
          description={link.description}
          icon={link.icon ? IconMap[link.icon] || <Globe size={24} /> : <Globe size={24} />}
          variant={link.variant}
          isExternal={link.isExternal}
        />
      ))}

      {/* Social Media Section */}
      <LinktreeCard
        title="Follow Us"
        content="Ikuti kami di social media untuk update terbaru tentang acara, workshop, dan kegiatan DIGCITY"
        socialLinks={socialLinks}
        variant="social"
      />

      {/* Event Instagram Section */}
      <LinktreeCard
        title="🎉 Instagram Acara"
        content="Ikuti Instagram khusus acara DIGCITY untuk update event, workshop, dan kegiatan terbaru"
        socialLinks={[
          {
            platform: 'instagram',
            value: '@dbasic.official',
            href: 'https://instagram.com/dbasic.official'
          }
        ]}
        variant="social"
      />

      {/* Contact Information */}
      <LinktreeCard
        title="Contact Info"
        content="Hubungi kami untuk informasi lebih lanjut tentang keanggotaan, acara, atau kolaborasi"
        socialLinks={contactInfo}
        variant="contact"
      />

      {/* About Section */}
      <LinktreeCard
        title="Tentang DIGCITY"
        content="DIGCITY adalah Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor yang menekankan nilai Berdampak, Adaptif, Inovatif, dan Kompeten dalam pengembangan potensi mahasiswa."
        variant="info"
      />

      {/* Values Section */}
      <LinktreeCard
        title="Nilai-Nilai Kami"
        content="Berdampak - Adaptif - Inovatif - Kompeten"
        variant="info"
      />
    </LinktreeLayout>
  );
};

export default LinktreePage;
