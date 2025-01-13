"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

export default function LoginPage() {
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to seed database')
      
      toast.success('Database seeded successfully!')
    } catch (error) {
      toast.error('Failed to seed database')
      console.error(error)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* ... existing login form ... */}
      
      <Button
        onClick={handleSeed}
        disabled={isSeeding}
        className="mt-4 bg-green-600 hover:bg-green-700"
      >
        {isSeeding ? 'Seeding...' : 'Seed Database'}
      </Button>
    </div>
  )
} 