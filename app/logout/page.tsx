"use client"

import { useEffect } from "react"
import { handleLogout } from "../lib/actions/logout"

export default function LogoutPage() {
  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center">
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  )
} 