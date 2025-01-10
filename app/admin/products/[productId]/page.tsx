"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Package, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { AdminNav } from "../../components/admin-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

interface StockMovement {
  id: string
  type: 'IN' | 'OUT'
  quantity: number
  date: string
  reason: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.productId}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data.product)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.productId])

  const stockMovements: StockMovement[] = [
    {
      id: '1',
      type: 'IN',
      quantity: 50,
      date: '2024-03-15T10:00:00Z',
      reason: 'Restock from supplier'
    },
    {
      id: '2',
      type: 'OUT',
      quantity: 5,
      date: '2024-03-14T15:30:00Z',
      reason: 'Order #12345'
    },
    {
      id: '3',
      type: 'IN',
      quantity: 25,
      date: '2024-03-13T09:15:00Z',
      reason: 'Inventory adjustment'
    },
    {
      id: '4',
      type: 'OUT',
      quantity: 10,
      date: '2024-03-12T14:20:00Z',
      reason: 'Order #12344'
    },
    {
      id: '5',
      type: 'OUT',
      quantity: 3,
      date: '2024-03-11T16:45:00Z',
      reason: 'Order #12343'
    }
  ]

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AdminNav />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-center">Loading product details...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AdminNav />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-center">Product not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Back to Products
            </Button>
          </div>

          <Card className="mb-5">
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h2 className="text-2xl font-bold">{product.name}</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Category</h3>
                  <p>{product.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Price</h3>
                  <p>${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Stock Level</h3>
                  <p>{product.stock} units</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Stock Movement History</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {stockMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {movement.type === 'IN' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {movement.type === 'IN' ? 'Stock In' : 'Stock Out'}{' '}
                          <Badge variant={movement.type === 'IN' ? 'default' : 'destructive'}>
                            {movement.type === 'IN' ? '+' : '-'}{movement.quantity} units
                          </Badge>
                        </p>
                        <p className="text-sm text-gray-500">{movement.reason}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(movement.date), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 