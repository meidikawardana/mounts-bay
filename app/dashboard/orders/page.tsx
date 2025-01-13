"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { OrderSearch } from "./components/order-search"
import { SortableHeader } from "./components/sortable-header"
import { Pagination } from "./components/pagination"
import { ExportButton } from "./components/export-button"
import { UserNav } from "../components/user-nav"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from "next-auth/react"
import { webSocketService } from "../../services/websocket-service"

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
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  const { data: session } = useSession()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    // Connect to WebSocket with user ID
    webSocketService.connect(session.user.id)

    // Listen for order status updates
    webSocketService.onOrderStatusUpdate((data) => {
      toast.info(`Order #${data.orderId.slice(0, 8)}: ${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    })

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders)
      setFilteredOrders(data.orders)
    } catch (error) {
      setError('Failed to load orders')
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = orders.filter(order => 
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrders(filtered)
  }

  const handleStatusFilter = (status: string) => {
    if (status === 'ALL') {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(order => order.status === status)
      setFilteredOrders(filtered)
    }
  }

  const handleSort = (column: string) => {
    const isAsc = sortColumn === column && sortDirection === 'asc'
    const newDirection = isAsc ? 'desc' : 'asc'
    
    setSortColumn(column)
    setSortDirection(newDirection)

    const sorted = [...filteredOrders].sort((a, b) => {
      let valueA, valueB

      switch (column) {
        case 'id':
          valueA = a.id
          valueB = b.id
          break
        case 'product':
          valueA = a.product.name
          valueB = b.product.name
          break
        case 'quantity':
          valueA = a.quantity
          valueB = b.quantity
          break
        case 'price':
          valueA = a.quantity * a.product.price
          valueB = b.quantity * b.product.price
          break
        case 'deliveryDate':
          valueA = new Date(a.deliveryDate).getTime()
          valueB = new Date(b.deliveryDate).getTime()
          break
        case 'status':
          valueA = a.status
          valueB = b.status
          break
        default:
          return 0
      }

      if (valueA < valueB) return newDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return newDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredOrders(sorted)
  }

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [filteredOrders])

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <UserNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-6xl mx-auto text-center">
            Loading orders...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <UserNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-6xl mx-auto text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <UserNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
            <div className="flex items-center gap-4">
              {/* <Button
                onClick={() => toast.success('🦄 Test notification!')}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Show Toast
              </Button> */}
              <ExportButton 
                orders={filteredOrders}
                isDisabled={filteredOrders.length === 0}
              />
              <Link href="/dashboard/orders/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 p-2">
                  <Package className="h-4 w-4" />
                  Place New Order
                </Button>
              </Link>
            </div>
          </div>

          <OrderSearch 
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
          />

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Your Orders</h2>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader
                      column="id"
                      label="Order Number"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      column="product"
                      label="Product"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      column="quantity"
                      label="Quantity"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      column="price"
                      label="Total Price"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      column="deliveryDate"
                      label="Delivery Date"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      column="status"
                      label="Status"
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow 
                        key={order.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                      >
                        <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
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
                                ? 'secondary'
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
                  onPageChange={handlePageChange}
                />
              )}
            </CardContent>
          </Card>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </div>
  )
} 