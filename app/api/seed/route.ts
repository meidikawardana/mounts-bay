import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { main } from '../../../prisma/seed'

const prisma = new PrismaClient()

export async function POST() {
    try {
        await main()

        return NextResponse.json({ message: "Database seeded successfully" })
    } catch (error) {
        console.error('Seeding error:', error)
        return NextResponse.json(
            { error: "Failed to seed database" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 