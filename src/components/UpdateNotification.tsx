import React, { useState, useEffect } from 'react';
import { cacheManager, checkWebsiteUpdates } from '../utils/cacheManager';

interface UpdateNotificationProps {
  onUpdate?: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onUpdate }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check update setiap 5 menit
    const checkInterval = setInterval(async () => {
      await checkForUpdates();
    }, 5 * 60 * 1000);

    // Check update saat component mount
    checkForUpdates();

    // Check update saat user kembali ke website
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const hasUpdate = await checkWebsiteUpdates();
      
      if (hasUpdate) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Gagal check update:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setShowNotification(false);
      
      // Clear cache dan refresh
      await cacheManager.forceRefresh();
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Gagal update:', error);
      // Fallback: reload manual
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            Update Tersedia
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Website telah diperbarui. Refresh untuk mendapatkan konten terbaru.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleUpdate}
          disabled={isChecking}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          {isChecking ? 'Memperbarui...' : 'Update Sekarang'}
        </button>
        
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          Nanti
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-center">
        Update otomatis setiap 24 jam
      </div>
    </div>
  );
};

export default UpdateNotification;
