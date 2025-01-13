import { NextResponse } from 'next/server'

// Mock data
const mockAnalytics = {
    totalOrders: 156,
    popularProducts: [
        { name: "Smartphone X", orders: 45 },
        { name: "Laptop Pro", orders: 38 },
        { name: "Wireless Earbuds", orders: 30 },
        { name: "Smart Watch", orders: 25 },
        { name: "Tablet Mini", orders: 18 }
    ],
    ordersByCategory: [
        { category: "Electronics", orders: 82 },
        { category: "Clothing", orders: 45 },
        { category: "Books", orders: 20 },
        { category: "Home", orders: 9 }
    ],
    averageDeliveryTime: 3.5
}

export async function POST(req: Request) {
    try {
        const { category } = await req.json()

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // If category filter is applied
        if (category && category !== 'all') {
            return NextResponse.json({
                ...mockAnalytics,
                totalOrders: mockAnalytics.ordersByCategory.find(c => c.category === category)?.orders || 0,
                ordersByCategory: mockAnalytics.ordersByCategory.filter(c => c.category === category)
            })
        }

        return NextResponse.json(mockAnalytics)
    } catch (error) {
        console.error('Analytics API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        )
    }
} 