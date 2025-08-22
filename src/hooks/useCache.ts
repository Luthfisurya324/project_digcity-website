import { useState, useEffect, useCallback } from 'react';
import { cacheManager, CacheConfig } from '../utils/cacheManager';

export const useCache = () => {
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCacheInfo = useCallback(() => {
    const info = cacheManager.getCacheInfo();
    setCacheInfo(info);
  }, []);

  const clearAllCaches = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await cacheManager.clearAllCaches();
      
      if (success) {
        loadCacheInfo();
        return { success: true, message: 'Cache berhasil di-clear!' };
      } else {
        return { success: false, message: 'Gagal clear cache.' };
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false, message: 'Terjadi error saat clear cache.' };
    } finally {
      setIsLoading(false);
    }
  }, [loadCacheInfo]);

  const forceRefresh = useCallback(async () => {
    try {
      setIsLoading(true);
      await cacheManager.forceRefresh();
    } catch (error) {
      console.error('Error force refresh:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearExpiredCaches = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await cacheManager.clearExpiredCaches();
      
      if (success) {
        loadCacheInfo();
        return { success: true, message: 'Expired cache berhasil di-clear!' };
      } else {
        return { success: false, message: 'Gagal clear expired cache.' };
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return { success: false, message: 'Terjadi error saat clear expired cache.' };
    } finally {
      setIsLoading(false);
    }
  }, [loadCacheInfo]);

  const checkForUpdates = useCallback(async () => {
    try {
      return await cacheManager.checkForUpdates();
    } catch (error) {
      console.error('Error checking updates:', error);
      return false;
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<CacheConfig>) => {
    try {
      cacheManager.updateConfig(newConfig);
      loadCacheInfo();
      return { success: true, message: 'Config cache berhasil diupdate!' };
    } catch (error) {
      console.error('Error updating config:', error);
      return { success: false, message: 'Gagal update config cache.' };
    }
  }, [loadCacheInfo]);

  useEffect(() => {
    loadCacheInfo();
  }, [loadCacheInfo]);

  return {
    cacheInfo,
    isLoading,
    clearAllCaches,
    forceRefresh,
    clearExpiredCaches,
    checkForUpdates,
    updateConfig,
    loadCacheInfo
  };
};
