import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { db } from "../../../../lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const order = await db.order.findUnique({
            where: { id },
            include: { product: true }
        })

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        // Check if order can be cancelled
        if (order.status === "DELIVERED" || order.status === "CANCELLED") {
            return NextResponse.json(
                { error: "Order cannot be cancelled" },
                { status: 400 }
            )
        }
        // Cancel order and restore product stock in a transaction
        const updatedOrder = await db.$transaction(async (tx) => {
            // Update order status
            const cancelled = await tx.order.update({
                where: { id },
                data: { status: 'CANCELLED' },
                include: {
                    product: true
                }
            })

            // Restore product stock
            await tx.product.update({
                where: { id: cancelled.productId },
                data: {
                    stock: {
                        increment: cancelled.quantity
                    }
                }
            })

            return cancelled
        })

        return NextResponse.json({ order: updatedOrder })
    } catch (error) {
        console.error("Order cancellation error:", error)
        return NextResponse.json(
            { error: "Failed to cancel order" },
            { status: 500 }
        )
    }
} 