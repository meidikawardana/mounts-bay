import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "../../../../lib/db"
import { authOptions } from "../../../../lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await Promise.resolve(params)
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

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

        const user = await db.user.findUnique({
            where: { id: resolvedParams.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                address: true,
                createdAt: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('User fetch error:', error)
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await Promise.resolve(params)
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

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

        const body = await request.json()
        const { name, email, role, address } = body

        const updatedUser = await db.user.update({
            where: { id: resolvedParams.id },
            data: { name, email, role, address },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                address: true,
                createdAt: true
            }
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error('User update error:', error)
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        )
    }
} 