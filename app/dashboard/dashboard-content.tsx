"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { handleLogout } from "../lib/actions/logout"

export default function DashboardContent() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border-2 border-gray-200 p-2"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:rotate-180" />
            Logout
          </Button>
        </div>
        <Card>
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">Customer Dashboard</h2>
            <p className="text-gray-200">Welcome to your dashboard</p>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600">Your orders and account information will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 