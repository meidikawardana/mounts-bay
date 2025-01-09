"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AdminNav } from "../components/admin-nav"

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-gray-200">Welcome to the admin dashboard</p>
            </CardHeader>
            <CardContent className="p-6">
              <p>Select an option from the navigation menu to get started.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 