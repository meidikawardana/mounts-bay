"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Pagination } from "../../dashboard/orders/components/pagination"
import { useRouter } from "next/navigation"
import { AdminNav } from "../components/admin-nav"

interface User {
  id: string
  name: string
  email: string
  role: string
  address: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      console.error(err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const totalPages = Math.ceil(users.length / usersPerPage)

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-6xl mx-auto text-center">
            Loading users...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
          <div className="max-w-6xl mx-auto text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
          </div>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Users</h2>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.address || 'Not provided'}</TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {users.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 