import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { db } from '../../../lib/db'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        console.log('Session:', session)

        if (!session?.user?.email || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized', session: session },
                { status: 401 }
            )
        }

        const orders = await db.order.findMany({
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
        console.error('Admin orders fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
} 