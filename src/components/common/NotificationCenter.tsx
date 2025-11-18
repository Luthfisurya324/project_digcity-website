import React, { createContext, useContext, useState, useCallback } from 'react'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message?: string
}

interface NotificationContextValue {
  notify: (item: Omit<NotificationItem, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<NotificationItem[]>([])

  const notify = useCallback((item: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const next = { ...item, id }
    setItems((prev) => [next, ...prev])
    // Auto-dismiss after 4s
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, 4000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {items.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg px-4 py-3 shadow-lg border transition-colors ${
              n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100'
              : n.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100'
              : n.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100'
            }`}
          >
            <div className="font-semibold text-sm">{n.title}</div>
            {n.message && <div className="text-xs mt-1 opacity-80">{n.message}</div>}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

