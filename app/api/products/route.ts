import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { db } from "../../lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const products = await db.product.findMany({
            where: {
                stock: {
                    gt: 0 // Only show products with stock > 0
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({ products })

    } catch (error) {
        console.error('Products fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
} 