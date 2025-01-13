import { NextResponse } from "next/server"
import { db } from "../../../lib/db"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params;
    try {
        const product = await db.product.findUnique({
            where: {
                id: productId
            }
        })

        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }

        const productWithImage = {
            ...product,
            // Use a placeholder image service instead
            image: `https://picsum.photos/seed/${product.id}/400/300`
        }

        return NextResponse.json({ product: productWithImage })
    } catch (error) {
        console.error("[PRODUCT_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
} 