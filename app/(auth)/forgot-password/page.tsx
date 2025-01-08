"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")

    try {
      // In a real app, this would call an API endpoint to send a reset email
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setStatus("success")
    } catch (error: unknown) {
      console.error(error) // Log the error
      setStatus("error") 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Card className="w-[400px] shadow-xl border-0">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-gray-200">Enter your email to receive reset instructions</p>
        </CardHeader>
        <CardContent className="p-6">
          {status === "success" ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 bg-green-50 p-4 rounded">
                If an account exists with {email}, you will receive password reset instructions.
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-gray-50 w-full"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 p-2"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50/50 rounded-b-lg">
          <div className="text-sm text-gray-600 text-center">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 