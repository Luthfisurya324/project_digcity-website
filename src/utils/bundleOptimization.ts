/**
 * Bundle Optimization Utilities
 * Advanced code splitting and bundle optimization strategies
 */

// Dynamic import with error handling and retry logic
export const dynamicImport = async <T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Dynamic import failed (attempt ${i + 1}/${retries}):`, error);
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Dynamic import failed after all retries');
};