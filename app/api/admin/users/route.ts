import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { db } from "../../../lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Verify admin role
        const currentUser = await db.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        })

        if (currentUser?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                address: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ users })

    } catch (error) {
        console.error('Users fetch error:', error)
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        )
    }
} 