"use client"

import { TableHead } from "@/components/ui/table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableHeaderProps {
  column: string
  label: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc' | null
  onSort: (column: string) => void
}

export function SortableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort
}: SortableHeaderProps) {
  return (
    <TableHead
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        <span className={cn(
          "transition-opacity",
          sortColumn === column ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )}>
          {sortColumn === column ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </span>
      </div>
    </TableHead>
  )
} 