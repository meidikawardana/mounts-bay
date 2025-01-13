import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
} 