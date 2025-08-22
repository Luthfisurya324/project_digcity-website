import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface LinktreeButtonProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  isExternal?: boolean;
  onClick?: () => void;
}

const LinktreeButton: React.FC<LinktreeButtonProps> = ({
  href,
  title,
  description,
  icon,
  variant = 'primary',
  isExternal = true,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-700/30';
      case 'secondary':
        return 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg shadow-secondary-600/20 hover:shadow-xl hover:shadow-secondary-700/30';
      case 'accent':
        return 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg shadow-accent-500/20 hover:shadow-xl hover:shadow-accent-600/30';
      default:
        return 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-700/30';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={handleClick}
        className={`w-full p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${getVariantClasses()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="text-left">
              <h3 className="font-semibold text-lg">{title}</h3>
              {description && (
                <p className="text-sm opacity-90 mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {isExternal ? (
              <ExternalLink size={20} className="opacity-80 transition-transform group-hover:scale-110" />
            ) : (
              <ArrowRight size={20} className="opacity-80 transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default LinktreeButton;
