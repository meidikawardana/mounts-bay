import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { db } from "../../../../lib/db"

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

        const order = await db.order.findUnique({
            where: { id: resolvedParams.id },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Order fetch error:', error)
        return NextResponse.json(
            { error: "Failed to fetch order" },
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
        const { status } = body

        const updatedOrder = await db.order.update({
            where: { id: resolvedParams.id },
            data: { status },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json({ order: updatedOrder })
    } catch (error) {
        console.error('Order update error:', error)
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        )
    }
} 