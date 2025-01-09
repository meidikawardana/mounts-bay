"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { use } from "react"
import { useNotifications } from "../../../contexts/notifications-context"

interface User {
  id: string
  name: string
  email: string
  role: string
  address: string
  createdAt: string
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { showNotification } = useNotifications()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    address: ""
  })

  useEffect(() => {
    fetchUser()
  }, [resolvedParams.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      const data = await response.json()
      setUser(data.user)
      setFormData({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        address: data.user.address || ""
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      showNotification("Failed to load user details", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update user')
      
      showNotification("User updated successfully", "success")
      router.push('/admin/users')
    } catch (error) {
      console.error("Error updating user:", error)
      showNotification("Failed to update user", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-2xl mx-auto text-center">
          Loading user details...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-2xl mx-auto text-center text-red-500">
          User not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <h2 className="text-xl font-semibold">Edit User</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/users')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 