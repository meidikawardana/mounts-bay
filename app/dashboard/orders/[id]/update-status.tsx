"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNotifications } from "../../../contexts/notifications-context"

interface UpdateStatusProps {
  orderId: string
  currentStatus: string
  onStatusUpdate: () => void
}

export function UpdateStatus({ orderId, currentStatus, onStatusUpdate }: UpdateStatusProps) {
  const { showNotification } = useNotifications()
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update status')
      }

      showNotification(`Order status updated to ${newStatus}`, "success")
      onStatusUpdate()
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error")
      } else {
        showNotification("An unexpected error occurred", "error")
      }
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={updating || currentStatus === "CANCELLED"}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="SHIPPED">Shipped</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
      </SelectContent>
    </Select>
  )
} 