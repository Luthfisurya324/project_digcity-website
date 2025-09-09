import React, { useState, useEffect } from 'react';
import { cacheManager, CacheConfig } from '../../utils/cacheManager';

interface CacheControlProps {
  isAdmin?: boolean;
  onCacheCleared?: () => void;
}

const CacheControl: React.FC<CacheControlProps> = ({ isAdmin = false, onCacheCleared }) => {
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState<Partial<CacheConfig>>({});

  useEffect(() => {
    loadCacheInfo();
  }, []);

  const loadCacheInfo = () => {
    const info = cacheManager.getCacheInfo();
    setCacheInfo(info);
  };

  const handleClearCache = async () => {
    try {
      setIsLoading(true);
      const success = await cacheManager.clearAllCaches();
      
      if (success) {
        loadCacheInfo();
        if (onCacheCleared) {
          onCacheCleared();
        }
        
        // Show success message
        alert('Cache berhasil di-clear! Website akan refresh otomatis.');
        
        // Auto refresh setelah 2 detik
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert('Gagal clear cache. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Terjadi error saat clear cache.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = async () => {
    try {
      setIsLoading(true);
      await cacheManager.forceRefresh();
    } catch (error) {
      console.error('Error force refresh:', error);
      alert('Terjadi error saat force refresh.');
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = () => {
    try {
      cacheManager.updateConfig(config);
      loadCacheInfo();
      alert('Config cache berhasil diupdate!');
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Gagal update config cache.');
    }
  };

  const handleClearExpiredCache = async () => {
    try {
      setIsLoading(true);
      const success = await cacheManager.clearExpiredCaches();
      
      if (success) {
        loadCacheInfo();
        alert('Expired cache berhasil di-clear!');
      } else {
        alert('Gagal clear expired cache.');
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      alert('Terjadi error saat clear expired cache.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cache Control</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showAdvanced ? 'Sembunyikan' : 'Tampilkan'} Advanced
        </button>
      </div>

      {/* Cache Info */}
      {cacheInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Cache</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-600">{cacheInfo.version}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Update:</span>
              <span className="ml-2 text-gray-600">
                {new Date(cacheInfo.lastUpdate).toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Max Age:</span>
              <span className="ml-2 text-gray-600">
                {Math.round(cacheInfo.maxAge / (1000 * 60 * 60))} jam
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Auto Clear:</span>
              <span className="ml-2 text-gray-600">
                {cacheInfo.autoClear ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleClearCache}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>{isLoading ? 'Clearing...' : 'Clear All Cache'}</span>
        </button>

        <button
          onClick={handleForceRefresh}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isLoading ? 'Refreshing...' : 'Force Refresh'}</span>
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Options</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleClearExpiredCache}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Clear Expired Cache Only
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Age (jam)
                </label>
                <input
                  type="number"
                  value={config.maxAge ? Math.round(config.maxAge / (1000 * 60 * 60)) : 24}
                  onChange={(e) => setConfig({
                    ...config,
                    maxAge: parseInt(e.target.value) * 1000 * 60 * 60
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="168"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Clear
                </label>
                <select
                  value={config.autoClear !== undefined ? config.autoClear.toString() : 'true'}
                  onChange={(e) => setConfig({
                    ...config,
                    autoClear: e.target.value === 'true'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdateConfig}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Update Config
            </button>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Cache akan di-clear otomatis setiap 24 jam untuk memastikan konten selalu terbaru
        </p>
      </div>
    </div>
  );
};

export default CacheControl;
