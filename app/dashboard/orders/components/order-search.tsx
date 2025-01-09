"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderSearchProps {
  onSearch: (search: string) => void
  onStatusFilter: (status: string) => void
}

export function OrderSearch({ onSearch, onStatusFilter }: OrderSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select onValueChange={onStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="w-[--radix-select-trigger-width] bg-white">
          <SelectItem value="ALL" className="w-full">
            <span className="flex items-center pl-6">All Orders</span>
          </SelectItem>
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
  )
} 