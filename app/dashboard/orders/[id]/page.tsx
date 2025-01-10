"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, MapPin, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { UpdateStatus } from "./update-status"
import { CancelOrder } from "../components/cancel-order"
import { useNotifications } from "../../../contexts/notifications-context"
import { UserNav } from "../../components/user-nav"

interface Order {
  id: string
  product: {
    name: string
    price: number
  }
  quantity: number
  status: string
  deliveryDate: string
  address: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotifications()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch order')
      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error("Error fetching order:", error)
      showNotification("Failed to load order details", "error")
    } finally {
      setLoading(false)
    }
  }, [params.id, showNotification])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleOrderCancelled = () => {
    showNotification("Order cancelled successfully", "success")
    router.refresh()
    fetchOrder()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <UserNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-4xl mx-auto">
            Loading order details...
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen">
        <UserNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-4xl mx-auto">
            Order not found
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <UserNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/orders')}
            >
              Back to Orders
            </Button>
            <Button
              onClick={() => router.push(`/orders/${order.id}/tracking`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2 px-6 py-2"
            >
              <Truck className="h-5 w-5 animate-bounce" />
              Track Order
            </Button>
          </div>

          <Card>
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Order Details</h2>
                </div>
                <Badge
                  variant={
                    order.status === 'DELIVERED'
                      ? 'default'
                      : order.status === 'SHIPPED'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <p>{order.product.name}</p>
                  <p className="text-gray-600">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-gray-600">
                    Total: ${(order.quantity * order.product.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(order.deliveryDate), 'PPP')}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {order.address}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <UpdateStatus 
                  orderId={order.id} 
                  currentStatus={order.status}
                  onStatusUpdate={fetchOrder} 
                />
                <CancelOrder 
                  orderId={order.id} 
                  onCancelled={handleOrderCancelled}
                  disabled={order.status !== 'PENDING'} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 