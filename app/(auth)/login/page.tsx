"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Lock, LogIn } from "lucide-react"
import { toast } from "react-toastify"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      isAdmin: isAdmin,
      redirect: false,
    })

    if (response?.error) {
      setError("Invalid credentials")
      return
    }

    router.push(isAdmin ? "/admin/dashboard" : "/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Card className="w-[400px] shadow-xl border-0">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isAdmin ? "Admin Login" : "Customer Login"}
          </h2>
          <p className="text-gray-200">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full p-2"
              onClick={() => setIsAdmin(!isAdmin)}
            >
              Switch to {isAdmin ? "Customer" : "Admin"} Login
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-gray-50 w-full"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-gray-50 w-full"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 p-2"
            >
              <LogIn className="h-4 w-4" /> 
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50/50 rounded-b-lg">
          <div className="text-sm text-gray-600 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </div>
          <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 text-center">
            Forgot your password?
          </Link>

          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="mt-4 relative overflow-hidden group bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-96 ease"></span>
            <div className="flex items-center gap-2">
              {isSeeding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Seeding Database...</span>
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5 animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span>Seed Database</span>
                </>
              )}
            </div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 