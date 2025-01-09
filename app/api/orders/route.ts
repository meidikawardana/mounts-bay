import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { db } from '../../lib/db'
import { PrismaClient } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "You must be logged in to create an order" },
                { status: 401 }
            )
        }

        const { productId, quantity, deliveryDate, address } = await req.json()

        // Validate required fields with specific messages
        if (!productId) {
            return NextResponse.json(
                { error: "Product selection is required" },
                { status: 400 }
            )
        }
        if (!quantity) {
            return NextResponse.json(
                { error: "Quantity is required" },
                { status: 400 }
            )
        }
        if (!deliveryDate) {
            return NextResponse.json(
                { error: "Delivery date is required" },
                { status: 400 }
            )
        }
        if (!address) {
            return NextResponse.json(
                { error: "Delivery address is required" },
                { status: 400 }
            )
        }

        // Get the product to check stock
        const product = await db.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json(
                { error: `Product with ID ${productId} not found` },
                { status: 404 }
            )
        }

        if (product.stock < quantity) {
            return NextResponse.json(
                {
                    error: `Insufficient stock. Only ${product.stock} units available, but ${quantity} requested`,
                    availableStock: product.stock
                },
                { status: 400 }
            )
        }

        // Create order and update stock in a transaction
        const order = await db.$transaction(async (tx: PrismaClient) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    quantity,
                    deliveryDate,
                    address,
                    status: "PENDING",
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    user: {
                        connect: {
                            email: session.user.email
                        }
                    }
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

            // Update product stock
            await tx.product.update({
                where: { id: productId },
                data: {
                    stock: {
                        decrement: quantity
                    }
                }
            })

            return newOrder
        })

        return NextResponse.json({
            message: "Order created successfully",
            order
        })

    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            {
                error: "Failed to create order",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // If user is admin, get all orders, otherwise get only user's orders
        const orders = await db.order.findMany({
            where: session.user.role === 'ADMIN'
                ? {}
                : { user: { email: session.user.email } },
            include: {
                product: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ orders })

    } catch (error) {
        console.error('Orders fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
} 