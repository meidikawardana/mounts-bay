import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, LayoutDashboard, LogOut } from "lucide-react"
import { handleLogout } from "../../lib/actions/logout"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Orders",
    icon: Package,
    href: "/dashboard/orders",
    color: "text-violet-500",
  },
]

export function UserNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col w-64 bg-gray-50 border-r px-3 py-4">
      <div className="flex flex-col flex-1 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-[500] pl-3 py-4 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100",
              pathname === route.href
                ? "text-gray-900 bg-gray-200"
                : "text-gray-500"
            )}
          >
            <route.icon className={cn("w-5 h-5", route.color)} />
            {route.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-x-2 text-sm font-[500] pl-3 py-4 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100 text-gray-500 mt-auto"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        Logout
      </button>
    </nav>
  )
} 