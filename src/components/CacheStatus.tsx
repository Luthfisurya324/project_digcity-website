import React, { useState, useEffect } from 'react';
import { useCache } from '../hooks/useCache';

interface CacheStatusProps {
  showDetails?: boolean;
  className?: string;
}

const CacheStatus: React.FC<CacheStatusProps> = ({ showDetails = false, className = '' }) => {
  const { cacheInfo, checkForUpdates } = useCache();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const checkUpdates = async () => {
      const update = await checkForUpdates();
      setHasUpdate(update);
      setLastChecked(new Date());
    };

    // Check updates setiap 10 menit
    const interval = setInterval(checkUpdates, 10 * 60 * 1000);
    
    // Check updates saat component mount
    checkUpdates();

    return () => clearInterval(interval);
  }, [checkForUpdates]);

  if (!cacheInfo) {
    return null;
  }

  const getStatusColor = () => {
    if (hasUpdate) return 'text-orange-500';
    if (cacheInfo.autoClear) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStatusIcon = () => {
    if (hasUpdate) return '🔄';
    if (cacheInfo.autoClear) return '✅';
    return '⏳';
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <span className={getStatusColor()}>
        {getStatusIcon()}
      </span>
      
      {showDetails && (
        <>
          <span className="text-gray-600">
            v{cacheInfo.version.substring(0, 8)}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {new Date(cacheInfo.lastUpdate).toLocaleDateString('id-ID')}
          </span>
        </>
      )}
      
      {hasUpdate && (
        <span className="text-orange-600 text-xs font-medium animate-pulse">
          Update tersedia
        </span>
      )}
      
      <span className="text-gray-400 text-xs">
        {lastChecked.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </span>
    </div>
  );
};

export default CacheStatus;
