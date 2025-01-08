"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { User, Phone, MapPin, Save } from "lucide-react"

export default function AccountPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-gray-200">Update your personal information</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <User className="absolute left-3 h-5 w-5 text-gray-400" />
                <Input
                  name="name"
                  placeholder="Full Name"
                  className="pl-10"
                  defaultValue="John Doe"
                />
              </div>

              <div className="relative flex items-center">
                <Phone className="absolute left-3 h-5 w-5 text-gray-400" />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  className="pl-10"
                  defaultValue="+1234567890"
                />
              </div>

              <div className="relative flex items-center">
                <MapPin className="absolute left-3 h-5 w-5 text-gray-400" />
                <Input
                  name="address"
                  placeholder="Address"
                  className="pl-10"
                  defaultValue="123 Main St, City, Country"
                />
              </div>
            </div>

            {success && (
              <div className="text-green-600 bg-green-50 p-4 rounded">
                Account information updated successfully!
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 py-6"
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 