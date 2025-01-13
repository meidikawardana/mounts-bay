"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Package, AlertTriangle, AlertCircle, Search } from "lucide-react"
import { AdminNav } from "../components/admin-nav"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { FilteredDropdown } from "../../components/ui/filtered-dropdown"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = Array.from(new Set(products.map(product => product.category)))
  const lowStockProducts = products.filter(product => product.stock <= 10)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Show notifications for low stock products
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        toast.warning(
          <div>
            <div className="font-bold">Low Stock Alert!</div>
            <div className="text-sm mt-1">{product.name}</div>
            <div className="text-sm text-red-600 mt-1">
              Only {product.stock} items remaining
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        )
      })
    }
  }, [lowStockProducts])

  const handleRowClick = (productId: string) => {
    router.push(`/admin/products/${productId}`)
  }

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(category => ({
      value: category,
      label: category
    }))
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto space-y-6">
          {lowStockProducts.length > 0 && (
            <Alert variant="destructive" className="border-red-600 py-2 px-5">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <div className="font-medium">Low Stock Alert!</div>
              </div>
              <AlertDescription className="mt-2">
                The following products need attention:
                <ul className="list-disc list-inside mt-2">
                  {lowStockProducts.map(product => (
                    <li key={product.id}>
                      {product.name} - Only {product.stock} items remaining
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Products Inventory</h2>
                </div>
                {lowStockProducts.length > 0 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {lowStockProducts.length} Products Low in Stock
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <FilteredDropdown
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  placeholder="All Categories"
                  options={categoryOptions}
                />
              </div>

              {loading ? (
                <div className="text-center py-4">Loading products...</div>
              ) : (
                <>
                  <div className="text-sm text-gray-500 mb-4">
                    {filteredProducts.length} products found
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow 
                          key={product.id}
                          className={cn(
                            product.stock <= 10 ? "bg-red-50" : "",
                            "cursor-pointer hover:bg-gray-100"
                          )}
                          onClick={() => handleRowClick(product.id)}
                        >
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            {product.stock <= 10 ? (
                              <Badge variant="destructive" className="flex items-center gap-1 bg-red-600 text-white">
                                <AlertTriangle className="h-4 w-4" />
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge variant="default">In Stock</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
  )
} 