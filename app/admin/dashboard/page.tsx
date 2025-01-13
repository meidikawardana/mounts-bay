"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AdminNav } from "../components/admin-nav"
import { DateRangePicker } from "../../components/ui/date-range-picker"
import { FilteredDropdown } from "../../components/ui/filtered-dropdown"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Package, Truck, Clock } from "lucide-react"

interface AnalyticsData {
  totalOrders: number
  popularProducts: Array<{
    name: string
    orders: number
  }>
  averageDeliveryTime: number // in days
  ordersByCategory: Array<{
    category: string
    orders: number
  }>
}

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/admin/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRange,
            category: selectedCategory,
          }),
        })
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [dateRange, selectedCategory])

  const categories = ["all", "Electronics", "Clothing", "Books", "Home"] // Replace with your categories

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Skeleton Loading UI */}
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-10 w-[300px] bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-[200px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="col-span-2">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <div className="flex gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={(date) => {
                  if (date?.from && date?.to) {
                    setDateRange({ from: date.from, to: date.to })
                  } else {
                    setDateRange(undefined)
                  }
                }}
              />
              <FilteredDropdown
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                placeholder="Select Category"
              />
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Total Orders</h3>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalOrders || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Average Delivery Time</h3>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.averageDeliveryTime?.toFixed(1) || 0} days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Processing Time</h3>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24h</div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Products Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <h3 className="text-lg font-medium">Popular Products</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData?.popularProducts || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders by Category */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Orders by Category</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData?.ordersByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 