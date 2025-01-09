import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, Users, LayoutDashboard, LogOut } from "lucide-react"
import { handleLogout } from "../../lib/actions/logout"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: Package
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users
    }
  ]

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  pathname === item.href ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
} 