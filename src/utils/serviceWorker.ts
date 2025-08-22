/**
 * Service Worker Registration Utility
 * Mendaftarkan service worker untuk caching dan offline support
 */

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered successfully:', registration)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New service worker available')
            }
          })
        }
      })
      
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  } else {
    console.warn('Service Worker not supported in this browser')
    return null
  }
}

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
        console.log('Service Worker unregistered successfully')
        return true
      }
      return false
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
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
        console.log('Checking for service worker updates...')
      }
    } catch (error) {
      console.error('Failed to check for service worker updates:', error)
    }
  }
}
