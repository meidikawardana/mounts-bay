"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { Notifications } from "../components/notifications"
import type { NotificationType } from "../components/notifications"

interface NotificationsContextType {
  showNotification: (message: string, type: NotificationType) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    message: string
    type: NotificationType
  }>>([])

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Math.random().toString(36).slice(2)
    setNotifications((prev) => [...prev, { id, message, type }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, 5000)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
      <Notifications
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
} 