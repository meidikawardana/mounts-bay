"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AdminNav } from "../components/admin-nav"
import { format } from "date-fns"
import { 
  Truck, 
  Phone, 
  Mail, 
  Search,
  Filter
} from "lucide-react"
import { FilteredDropdown } from "../../components/ui/filtered-dropdown"
import { DatePicker } from "../../components/ui/date-picker"

interface Delivery {
  id: string
  orderId: string
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED"
  expectedDelivery: string
  driver: {
    name: string
    phone: string
    email: string
  }
  currentLocation?: string
}

export default function DeliveryManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>()

  // Mock data for demo
  const deliveries: Delivery[] = [
    {
      id: "1",
      orderId: "ORD-001",
      status: "IN_TRANSIT",
      expectedDelivery: "2024-03-20T14:00:00Z",
      driver: {
        name: "John Smith",
        phone: "+1 234-567-8900",
        email: "john.smith@example.com"
      },
      currentLocation: "Local Distribution Center"
    },
    {
      id: "2",
      orderId: "ORD-002",
      status: "PENDING",
      expectedDelivery: "2024-03-21T10:00:00Z",
      driver: {
        name: "Sarah Johnson",
        phone: "+1 234-567-8901",
        email: "sarah.j@example.com"
      }
    },
    {
      id: "3",
      orderId: "ORD-003",
      status: "DELIVERED",
      expectedDelivery: "2024-03-19T15:00:00Z",
      driver: {
        name: "Mike Wilson",
        phone: "+1 234-567-8902",
        email: "mike.w@example.com"
      }
    }
  ]

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus
    
    const matchesDate = !selectedDate || 
      format(new Date(delivery.expectedDelivery), "yyyy-MM-dd") === 
      format(selectedDate, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadgeVariant = (status: Delivery["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "default"
      case "IN_TRANSIT":
        return "secondary"
      case "PENDING":
        return "destructive"
    }
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "DELIVERED", label: "Delivered" }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Delivery Management</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by order ID or driver name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <FilteredDropdown
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  placeholder="Filter by status"
                  options={statusOptions}
                  icon={Filter}
                />
                <DatePicker
                  date={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    const popoverElement = document.querySelector('[role="dialog"]');
                    if (popoverElement) {
                      const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                      popoverElement.dispatchEvent(closeEvent);
                    }
                  }}
                  placeholder="Pick a date"
                  className="w-[180px]"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Current Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {delivery.orderId}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(delivery.status)}>
                          {delivery.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(delivery.expectedDelivery), "PPP")}
                      </TableCell>
                      <TableCell>{delivery.driver.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {delivery.driver.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {delivery.driver.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {delivery.currentLocation || "Not yet dispatched"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 