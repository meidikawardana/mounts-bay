import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { db } from "../../../../lib/db"

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

        const order = await db.order.update({
            where: { id: params.id },
            data: { status }
        })

        return NextResponse.json({ order })
    } catch (error) {
        console.error("Status update error:", error)
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        )
    }
} 