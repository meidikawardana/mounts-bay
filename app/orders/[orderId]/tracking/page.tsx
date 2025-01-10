"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Package, Truck, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface DeliveryStatus {
  status: "CONFIRMED" | "IN_TRANSIT" | "DELIVERED"
  timestamp: string
  location?: string
}

interface OrderTracking {
  orderId: string
  status: DeliveryStatus["status"]
  expectedDelivery: string
  currentLocation?: string
  statusHistory: DeliveryStatus[]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const [tracking, setTracking] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demo
  useEffect(() => {
    const mockTracking: OrderTracking = {
      orderId: params.orderId as string,
      status: "IN_TRANSIT",
      expectedDelivery: "2024-03-20T14:00:00Z",
      currentLocation: "Local Distribution Center",
      statusHistory: [
        {
          status: "CONFIRMED",
          timestamp: "2024-03-18T10:00:00Z",
          location: "Warehouse"
        },
        {
          status: "IN_TRANSIT",
          timestamp: "2024-03-19T08:30:00Z",
          location: "Local Distribution Center"
        }
      ]
    }
    
    setTracking(mockTracking)
    setLoading(false)
  }, [params.orderId])

  if (loading) {
    return <div className="container mx-auto p-8">Loading tracking information...</div>
  }

  if (!tracking) {
    return <div className="container mx-auto p-8">Order not found</div>
  }

  const getStatusIcon = (status: DeliveryStatus["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return <Package className="h-6 w-6" />
      case "IN_TRANSIT":
        return <Truck className="h-6 w-6" />
      case "DELIVERED":
        return <CheckCircle2 className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Order Tracking</h1>
              <div className="text-sm">Order #{tracking.orderId}</div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="h-4 w-4" />
                <span>Expected Delivery:</span>
                <span className="font-semibold">
                  {format(new Date(tracking.expectedDelivery), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
              {tracking.currentLocation && (
                <div className="text-sm text-gray-500">
                  Current Location: {tracking.currentLocation}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-[2px] bg-blue-200" />
              
              {tracking.statusHistory.map((status, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0 relative">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10 border-4 border-white">
                    {getStatusIcon(status.status)}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold">
                      {status.status.replace("_", " ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(status.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                    {status.location && (
                      <div className="text-sm text-gray-500">{status.location}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 