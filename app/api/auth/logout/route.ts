import { NextResponse } from 'next/server'

export async function POST() {
    try {
        return NextResponse.json(
            { message: 'Logged out successfully' },
            {
                status: 200,
                headers: {
                    'Set-Cookie': `next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                },
            }
        )
    } catch (error: unknown) {
        return NextResponse.json(
            { error: 'Failed to logout. Error: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        )
    }
} 