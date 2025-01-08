"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { OrderSearch } from "../../dashboard/orders/components/order-search"
import { ExportButton } from "../../dashboard/orders/components/export-button"
import { Pagination } from "../../dashboard/orders/components/pagination"

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

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders)
      setFilteredOrders(data.orders)
    } catch (err) {
      console.error(err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = orders.filter(order => 
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status: string) => {
    if (status === 'ALL') {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(order => order.status === status)
      setFilteredOrders(filtered)
    }
    setCurrentPage(1)
  }

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto text-center">
          Loading orders...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
          <div className="flex items-center gap-4">
            <ExportButton 
              orders={filteredOrders}
              isDisabled={filteredOrders.length === 0}
            />
          </div>
        </div>

        <OrderSearch 
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
        />

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <h2 className="text-xl font-semibold">Orders</h2>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.user.name}</span>
                          <span className="text-sm text-gray-500">{order.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.product.name}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        ${(order.quantity * order.product.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {order.address}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filteredOrders.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 