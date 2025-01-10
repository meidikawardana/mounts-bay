import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  align?: "start" | "center" | "end"
  disabled?: (date: Date) => boolean
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  align = "start",
  disabled
}: DatePickerProps) {
  return (
    <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal pl-3",
            !date && "text-muted-foreground",
            className
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
              {date ? format(date, "PPP") : placeholder}
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-white rounded-lg shadow-lg" align={align}>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onSelect}
                        disabled={disabled}              
                        initialFocus
                        className="rounded-md border-0"
                        classNames={{
                          nav: "flex items-center justify-between space-x-1 mb-4",
                          nav_button_previous: "!static -mt-4",
                          nav_button_next: "!static -mt-4",
                          head_cell: "w-9 font-normal text-gray-500",
                          cell: "w-9 h-9 text-center p-0 relative [&:has([aria-selected])]:bg-black first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:text-white",
                          caption: "text-sm text-center"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
  )
} 