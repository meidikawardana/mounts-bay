"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Lock, User, Phone, MapPin, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
          phone: formData.get('phone'),
          address: formData.get('address'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/login')
    } catch (error: unknown) {
      setError('Failed to register. Please try again. Details: ' + 
        (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Card className="w-[450px] shadow-xl border-0">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <h2 className="text-2xl font-bold tracking-tight text-white">Create an account</h2>
          <p className="text-gray-200">Enter your information to register</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                name="name"
                placeholder="Full Name"
                className="pl-10 bg-gray-50 w-full"
                required
              />
            </div>

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

            <div className="relative flex items-center">
              <Phone className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="pl-10 bg-gray-50 w-full"
                required
              />
            </div>

            <div className="relative flex items-center">
              <MapPin className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                name="address"
                placeholder="Address"
                className="pl-10 bg-gray-50 w-full"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 py-6"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50/50 rounded-b-lg">
          <div className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 