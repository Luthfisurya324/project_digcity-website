/**
 * Cache Manager untuk DIGCITY Website
 * Mengelola cache dengan sistem versioning dan auto-clear
 */

export interface CacheConfig {
  version: string;
  maxAge: number; // dalam milidetik
  autoClear: boolean;
  clearOnUpdate: boolean;
}

export class CacheManager {
  private static instance: CacheManager;
  private config: CacheConfig;
  private lastUpdate: number = Date.now();

  private constructor() {
    this.config = {
      version: this.generateVersion(),
      maxAge: 24 * 60 * 60 * 1000, // 24 jam default
      autoClear: true,
      clearOnUpdate: true
    };
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Generate version berdasarkan timestamp dan random string
   */
  private generateVersion(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `digcity-${timestamp}-${random}`;
  }

  /**
   * Clear semua cache yang ada
   */
  public async clearAllCaches(): Promise<boolean> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Cache Manager: Semua cache berhasil di-clear');
        
        // Clear localStorage cache juga
        this.clearLocalStorageCache();
        
        // Update timestamp
        this.lastUpdate = Date.now();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Cache Manager: Gagal clear cache:', error);
      return false;
    }
  }

  /**
   * Clear cache berdasarkan umur
   */
  public async clearExpiredCaches(): Promise<boolean> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const now = Date.now();
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            try {
              const response = await cache.match(request);
              if (response) {
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                  const responseDate = new Date(dateHeader).getTime();
                  if (now - responseDate > this.config.maxAge) {
                    await cache.delete(request);
                    console.log(`Cache Manager: Cache expired dihapus: ${request.url}`);
                  }
                }
              }
            } catch (error) {
              // Skip jika ada error pada request tertentu
              continue;
            }
          }
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Cache Manager: Gagal clear expired cache:', error);
      return false;
    }
  }

  /**
   * Clear localStorage cache
   */
  private clearLocalStorageCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => 
        key.startsWith('cache_') || 
        key.startsWith('image_') || 
        key.startsWith('api_')
      );
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Cache Manager: LocalStorage cache berhasil di-clear');
    } catch (error) {
      console.error('Cache Manager: Gagal clear localStorage cache:', error);
    }
  }

  /**
   * Force refresh dengan clear cache
   */
  public async forceRefresh(): Promise<boolean> {
    try {
      // Clear semua cache
      await this.clearAllCaches();
      
      // Reload halaman
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Cache Manager: Gagal force refresh:', error);
      return false;
    }
  }

  /**
   * Check apakah ada update baru
   */
  public async checkForUpdates(): Promise<boolean> {
    try {
      // Check service worker update
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          // Check jika ada service worker baru
          if (registration.waiting) {
            return true;
          }
        }
      }
      
      // Check cache version
      const currentVersion = this.config.version;
      const storedVersion = localStorage.getItem('digcity_cache_version');
      
      if (storedVersion !== currentVersion) {
        localStorage.setItem('digcity_cache_version', currentVersion);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Cache Manager: Gagal check update:', error);
      return false;
    }
  }

  /**
   * Setup auto-clear cache
   */
  public setupAutoClear(): void {
    if (!this.config.autoClear) return;
    
    // Clear expired cache setiap jam
    setInterval(() => {
      this.clearExpiredCaches();
    }, 60 * 60 * 1000);
    
    // Clear semua cache setiap 24 jam
    setInterval(() => {
      this.clearAllCaches();
    }, 24 * 60 * 60 * 1000);
    
    // Clear cache saat user kembali ke website
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.clearExpiredCaches();
      }
    });
    
    // Clear cache saat online/offline status berubah
    window.addEventListener('online', () => {
      this.clearExpiredCaches();
    });
    
    console.log('Cache Manager: Auto-clear setup berhasil');
  }

  /**
   * Get cache info
   */
  public getCacheInfo(): any {
    return {
      version: this.config.version,
      lastUpdate: this.lastUpdate,
      maxAge: this.config.maxAge,
      autoClear: this.config.autoClear
    };
  }

  /**
   * Update config
   */
  public updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Cache Manager: Config berhasil diupdate:', this.config);
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Utility functions
export const clearWebsiteCache = () => cacheManager.clearAllCaches();
export const forceRefreshWebsite = () => cacheManager.forceRefresh();
export const checkWebsiteUpdates = () => cacheManager.checkForUpdates();
