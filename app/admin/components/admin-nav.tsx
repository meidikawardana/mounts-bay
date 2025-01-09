import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
    color: "text-violet-500",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-pink-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-orange-500",
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="flex flex-col w-64 h-screen bg-gray-50 border-r">
      <div className="flex-1 px-3 py-4 overflow-y-auto">
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
      <div className="border-t px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-x-2 text-sm font-[500] pl-3 py-4 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100 text-gray-500"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          Logout
        </button>
      </div>
    </nav>
  )
} 