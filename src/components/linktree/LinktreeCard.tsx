import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface SocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'email' | 'phone' | 'location';
  value: string;
  href?: string;
}

interface LinktreeCardProps {
  title: string;
  content: string | React.ReactNode;
  socialLinks?: SocialLink[];
  variant?: 'info' | 'contact' | 'social';
}

const LinktreeCard: React.FC<LinktreeCardProps> = ({
  title,
  content,
  socialLinks = [],
  variant = 'info'
}) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={20} />;
      case 'facebook':
        return <Facebook size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'email':
        return <Mail size={20} />;
      case 'phone':
        return <Phone size={20} />;
      case 'location':
        return <MapPin size={20} />;
      default:
        return null;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'info':
        return 'bg-white/70 backdrop-blur border border-secondary-200 hover:shadow-xl hover:-translate-y-0.5';
      case 'contact':
        return 'bg-gradient-to-r from-secondary-50 to-primary-50 border border-secondary-200 hover:shadow-xl hover:-translate-y-0.5';
      case 'social':
        return 'bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 hover:shadow-xl hover:-translate-y-0.5';
      default:
        return 'bg-white/70 backdrop-blur border border-secondary-200 hover:shadow-xl hover:-translate-y-0.5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl transition-all duration-300 ${getVariantClasses()}`}
    >
      <h3 className="text-xl font-semibold text-secondary-900 mb-3">{title}</h3>
      
      <div className="text-secondary-600 mb-4 leading-relaxed">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>

      {socialLinks.length > 0 && (
        <div className="space-y-2">
          {socialLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
            >
              <div className="flex-shrink-0 text-secondary-500">
                {getIcon(link.platform)}
              </div>
              {link.href ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  {link.value}
                </a>
              ) : (
                <span className="font-medium">{link.value}</span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LinktreeCard;
