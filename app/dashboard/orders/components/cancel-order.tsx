"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "../../../contexts/notifications-context"

interface CancelOrderProps {
  orderId: string
  onCancelled: () => void
  disabled: boolean
}

export function CancelOrder({ orderId, onCancelled, disabled }: CancelOrderProps) {
  const { showNotification } = useNotifications()
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return
    }

    setCancelling(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to cancel order')
      }

      showNotification("Order cancelled successfully", "success")
      onCancelled()
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error")
      } else {
        showNotification("Failed to cancel order", "error")
      }
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleCancel}
      disabled={disabled || cancelling}
    >
      {cancelling ? "Cancelling..." : "Cancel Order"}
    </Button>
  )
} 