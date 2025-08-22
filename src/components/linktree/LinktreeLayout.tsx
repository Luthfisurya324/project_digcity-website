import React from 'react';
import { motion } from 'framer-motion';

interface LinktreeLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  avatar?: string;
}

const LinktreeLayout: React.FC<LinktreeLayoutProps> = ({
  children,
  title = "DigCity",
  subtitle = "Digital Innovation Community",
  avatar
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Background decorative elements similar to HomePage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary-400 via-secondary-400 to-primary-600" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-secondary-300 via-primary-300 to-secondary-500" />
        <div className="absolute top-1/3 -right-8 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gradient-to-br from-primary-200 to-secondary-300" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-md">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {avatar && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative">
                <img
                  src={avatar}
                  alt={title}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-xl object-cover"
                />
                {/* Decorative elements around avatar */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary-100">
                  <div className="w-3 h-3 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-secondary-100">
                  <div className="w-2 h-2 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full animate-pulse delay-1000" />
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-extrabold text-secondary-900 mb-3 tracking-tight"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-secondary-700 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 pt-8 border-t border-secondary-200"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-secondary-200 text-secondary-700 text-sm shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full"></div>
            <span className="font-medium">Powered by DigCity</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinktreeLayout;
