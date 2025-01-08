import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { db } from "../../../lib/db"

const OrderStatus = {
    PENDING: 'PENDING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const order = await db.order.findUnique({
            where: {
                id: params.id,
                ...(session.user.role !== 'ADMIN' && {
                    user: {
                        email: session.user.email
                    }
                })
            },
            include: {
                product: true,
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
            { error: 'Failed to fetch order' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { status } = await req.json()

        // Validate status
        if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
            return NextResponse.json(
                {
                    error: "Invalid status",
                    message: `Status must be one of: ${Object.values(OrderStatus).join(", ")}`,
                    providedStatus: status
                },
                { status: 400 }
            )
        }

        const updatedOrder = await db.order.update({
            where: {
                id: params.id
            },
            data: {
                status: status as OrderStatus
            },
            include: {
                product: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: "Order updated successfully",
            order: updatedOrder
        })

    } catch (error) {
        console.error('Order update error:', error)
        return NextResponse.json(
            {
                error: "Failed to update order",
                details: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
} 