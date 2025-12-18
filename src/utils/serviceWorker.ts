/**
 * Service Worker Registration Utility
 * Mendaftarkan service worker untuk caching dan offline support
 */

// Silent logging - hanya tampil di development
const isDev = import.meta.env.DEV
const devLog = (...args: unknown[]) => { if (isDev) console.log(...args) }
const devWarn = (...args: unknown[]) => { if (isDev) console.warn(...args) }
const devError = (...args: unknown[]) => { if (isDev) console.error(...args) }

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      devLog('✅ Service Worker registered')

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              devLog('🔄 New service worker available')
            }
          })
        }
      })

      return registration
    } catch (error) {
      devError('⚠️ Service Worker registration failed:', error)
      return null
    }
  } else {
    devWarn('⚠️ Service Worker not supported')
    return null
  }
}

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
        devLog('✅ Service Worker unregistered')
        return true
      }
      return false
    } catch (error) {
      devError('⚠️ Service Worker unregistration failed:', error)
      return false
    }
  }
  return false
}

export const checkForServiceWorkerUpdate = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        registration.update()
        devLog('🔍 Checking for service worker updates...')
      }
    } catch (error) {
      devError('⚠️ Failed to check for service worker updates:', error)
    }
  }
}
