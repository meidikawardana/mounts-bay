"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Package } from "lucide-react"
import { useNotifications } from "../../../contexts/notifications-context"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserNav } from "../../components/user-nav"

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const { showNotification } = useNotifications()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [deliveryDate, setDeliveryDate] = useState<Date>()
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
      showNotification("Failed to load products", "error")
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setAddress(data.user.address || '')
    } catch (error) {
      console.error("Error fetching profile:", error)
      showNotification("Failed to load address from profile", "error")
    }
  }, [showNotification])

  useEffect(() => {
    fetchProducts()
    fetchUserProfile()
  }, [fetchProducts, fetchUserProfile])

  const selectedProductDetails = products.find(p => p.id === selectedProduct)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !deliveryDate || !address) {
      showNotification("Please fill in all fields", "error")
      return
    }

    if (selectedProductDetails && parseInt(quantity) > selectedProductDetails.stock) {
      showNotification(`Only ${selectedProductDetails.stock} items available`, "error")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          quantity: parseInt(quantity),
          deliveryDate,
          address,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Error creating order:", error)
        throw new Error(error.error || 'Failed to create order')
      }
      
      showNotification("Order placed successfully", "success")
      router.push('/dashboard/orders')
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error")
      } else {
        showNotification("Failed to place order", "error")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <UserNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/orders')}
            >
              Back to Orders
            </Button>
          </div>

          <Card>
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h2 className="text-2xl font-bold">New Order</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Product</label>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a product">
                        {selectedProductDetails ? (
                          <div className="flex items-center justify-between w-full gap-8">
                            <span className="flex-shrink-0">{selectedProductDetails.name}</span>
                            <div className="flex items-center gap-4 text-gray-500 flex-shrink-0">
                              <span className="text-right">${selectedProductDetails.price.toFixed(2)}</span>
                              <span className="text-left">({selectedProductDetails.stock} available)</span>
                            </div>
                          </div>
                        ) : (
                          "Choose a product"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[--radix-select-trigger-width] bg-white max-h-[200px] overflow-y-auto">
                      {products.map((product) => (
                        <SelectItem 
                          key={product.id} 
                          value={product.id}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between w-full gap-8">
                            <span className="flex-shrink-0 pl-6">{product.name}</span>
                            <div className="flex items-center gap-4 text-gray-500 flex-shrink-0">
                              <span className="text-right">${product.price.toFixed(2)}</span>
                              <span className="text-left">({product.stock} available)</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max={selectedProductDetails?.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-white rounded-lg shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={(date) => {
                          setDeliveryDate(date);
                          const popoverElement = document.querySelector('[role="dialog"]');
                          if (popoverElement) {
                            const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                            popoverElement.dispatchEvent(closeEvent);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="rounded-md border-0"
                        classNames={{
                          nav: "flex items-center justify-between space-x-1 mb-4",
                          nav_button_previous: "!static -mt-4",
                          nav_button_next: "!static -mt-4",
                          head_cell: "w-9 font-normal text-gray-500",
                          cell: "w-9 h-9 text-center p-0 relative [&:has([aria-selected])]:bg-black first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:text-white",
                          caption: "text-sm text-center"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 