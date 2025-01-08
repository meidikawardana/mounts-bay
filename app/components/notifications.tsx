"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"

export type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationsProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function Notifications({ notifications, onDismiss }: NotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : notification.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : notification.type === "error" ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="flex-1">{notification.message}</p>
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 