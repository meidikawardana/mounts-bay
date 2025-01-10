import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LucideIcon } from "lucide-react"

interface FilteredDropdownProps {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: {
    value: string
    label: string
  }[]
  className?: string
  icon?: LucideIcon
}

export function FilteredDropdown({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  icon: Icon
}: FilteredDropdownProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={className || "w-[180px]"}>
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-[--radix-select-trigger-width] bg-white [&>div>span]:hidden">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
          >
            <span className="ml-[20px]">{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 