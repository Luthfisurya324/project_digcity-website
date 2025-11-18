import React, { useEffect, useState } from 'react';
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
import { linktreeAPI, LinktreeData, LinktreeLink as DBLink, SocialLink as DBSocial, ContactInfo as DBContact } from '../../lib/linktreeAPI';

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

  // State from Supabase
  const [profile, setProfile] = useState<LinktreeData | null>(null);
  const [links, setLinks] = useState<DBLink[]>([]);
  const [socials, setSocials] = useState<DBSocial[]>([]);
  const [contacts, setContacts] = useState<DBContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await linktreeAPI.getAllLinktreeData();
        setProfile(data.linktree);
        setLinks(data.links);
        setSocials(data.socialLinks);
        setContacts(data.contactInfo);
      } catch (e) {
        // Fallback to config if Supabase fetch fails
        setProfile(null);
        setLinks([]);
        setSocials([]);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Subscribe to realtime changes
    const unsubscribe = linktreeAPI.subscribeToChanges(async () => {
      try {
        const data = await linktreeAPI.getAllLinktreeData();
        setProfile(data.linktree);
        setLinks(data.links);
        setSocials(data.socialLinks);
        setContacts(data.contactInfo);
      } catch (err) {
        // Keep current state; optionally log
        console.warn('Realtime update failed, keeping current state', err);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fallback to config when DB empty
  const useConfigFallback = !profile && links.length === 0 && socials.length === 0 && contacts.length === 0;

  const activeLinks = useConfigFallback ? getActiveLinks(defaultLinktreeConfig) : links.map(l => ({
    id: l.id,
    href: l.href,
    title: l.title,
    description: l.description,
    icon: l.icon,
    variant: (l.variant as 'primary' | 'secondary' | 'accent') || 'primary',
    isExternal: l.is_external,
    isActive: l.is_active,
    order: l.order_index
  })).filter(l => l.isActive).sort((a, b) => a.order - b.order);

  const socialLinks = useConfigFallback ? getActiveSocialLinks(defaultLinktreeConfig).map(link => ({
    platform: link.platform as 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok',
    value: link.value,
    href: link.href
  })) : socials.filter(s => s.is_active).map(s => ({
    platform: s.platform as 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok',
    value: s.value,
    href: s.href
  }));

  const contactInfo = useConfigFallback ? getActiveContactInfo(defaultLinktreeConfig).map(info => ({
    platform: info.platform as 'email' | 'phone' | 'location' | 'address',
    value: info.value,
    href: info.href
  })) : contacts.filter(c => c.is_active).map(c => ({
    platform: (c.platform as 'email' | 'phone' | 'location' | 'address'),
    value: c.value,
    href: c.href
  }));

  return (
    <LinktreeLayout
      title={profile?.title || defaultLinktreeConfig.title}
      subtitle={profile?.subtitle || defaultLinktreeConfig.subtitle}
      avatar={profile?.avatar || defaultLinktreeConfig.avatar}
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

      {/* Instagram Acara section removed per request */}

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
