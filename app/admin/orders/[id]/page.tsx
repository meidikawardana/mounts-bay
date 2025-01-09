"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, MapPin, Package } from "lucide-react"
import { format } from "date-fns"
import { AdminNav } from "../../components/admin-nav"
import { use } from "react"
import { useNotifications } from "../../../contexts/notifications-context"

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

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { showNotification } = useNotifications()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch order')
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Error fetching order:", error)
        showNotification("Failed to load order details", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [resolvedParams.id, showNotification])

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order')
      
      const updatedOrder = await response.json()
      setOrder(updatedOrder.order)
      showNotification("Order status updated successfully", "success")
    } catch (error) {
      console.error("Error updating order:", error)
      showNotification("Failed to update order status", "error")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-3xl mx-auto text-center">
            Loading order details...
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-3xl mx-auto text-center text-red-500">
            Order not found
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/orders')}
            >
              Back to Orders
            </Button>
          </div>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <Badge
                  variant={
                    order.status === 'DELIVERED'
                      ? 'default'
                      : order.status === 'SHIPPED'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>Order Number: {order.id}</p>
                    <p>Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      Delivery Date: {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>Name: {order.user.name}</p>
                    <p>Email: {order.user.email}</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Address: {order.address}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    {order.product.name}
                  </p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Price per unit: ${order.product.price.toFixed(2)}</p>
                  <p className="font-medium">
                    Total: ${(order.quantity * order.product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-2">Update Order Status</h3>
                <div className="flex gap-4">
                  <Select
                    value={order.status}
                    onValueChange={updateOrderStatus}
                    disabled={updating}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="w-[--radix-select-trigger-width] bg-white">
                      <SelectItem value="PENDING" className="w-full">
                        <span className="flex items-center pl-6">Pending</span>
                      </SelectItem>
                      <SelectItem value="SHIPPED" className="w-full">
                        <span className="flex items-center pl-6">Shipped</span>
                      </SelectItem>
                      <SelectItem value="DELIVERED" className="w-full">
                        <span className="flex items-center pl-6">Delivered</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 