"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import { exportToCSV, exportToExcel } from "../../../lib/utils/export"

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

interface ExportButtonProps {
  orders: Order[]
  isDisabled?: boolean
}

export function ExportButton({ orders, isDisabled = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'excel' | 'csv') => {
    setIsExporting(true)
    try {
      const fileName = `orders-${new Date().toISOString().split('T')[0]}`
      if (format === 'excel') {
        await exportToExcel(orders, fileName)
      } else {
        await exportToCSV(orders, fileName)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isDisabled || isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 