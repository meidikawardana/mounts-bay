import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { db } from '../../../lib/db'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password, phone, address } = body

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await hash(password, 10)

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                role: 'CUSTOMER'
            }
        })

        return NextResponse.json(
            {
                user: {
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201 }
        )
    } catch (error: unknown) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
} 