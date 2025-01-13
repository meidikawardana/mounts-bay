import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to get random date within the last 30 days
const getRandomRecentDate = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
}

// Helper function to get delivery date (7-14 days from order date)
const getDeliveryDate = (orderDate: Date) => {
    const deliveryDays = Math.floor(Math.random() * (14 - 7 + 1)) + 7
    return new Date(orderDate.getTime() + (deliveryDays * 24 * 60 * 60 * 1000))
}

export const createOrders = (userIds: string[], productIds: string[]) => {
    return [
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: "DELIVERED",
            address: "123 Main St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "PENDING",
            address: "456 Oak Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 4) + 1,
            status: "SHIPPED",
            address: "789 Pine Rd, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "PENDING",
            address: "321 Elm St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "DELIVERED",
            address: "654 Maple Dr, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: "SHIPPED",
            address: "987 Cedar Ln, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "PENDING",
            address: "147 Birch Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "DELIVERED",
            address: "258 Willow St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: "SHIPPED",
            address: "369 Ash Rd, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "CANCELLED",
            address: "159 Oak St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "DELIVERED",
            address: "753 Pine Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 4) + 1,
            status: "PENDING",
            address: "951 Elm Rd, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "SHIPPED",
            address: "357 Maple St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: "DELIVERED",
            address: "852 Cedar Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "PENDING",
            address: "753 Birch Rd, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "CANCELLED",
            address: "159 Willow St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: "SHIPPED",
            address: "357 Ash Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 2) + 1,
            status: "DELIVERED",
            address: "951 Oak Rd, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: 1,
            status: "PENDING",
            address: "753 Pine St, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        },
        {
            userId: userIds[Math.floor(Math.random() * userIds.length)],
            productId: productIds[Math.floor(Math.random() * productIds.length)],
            quantity: Math.floor(Math.random() * 4) + 1,
            status: "SHIPPED",
            address: "852 Elm Ave, City, Country",
            createdAt: getRandomRecentDate(),
            deliveryDate: getDeliveryDate(new Date()),
        }
    ]
}

export async function main() {
    try {
        console.log('Starting seed...')

        // Create admin users
        await prisma.user.create({
            data: {
                email: "admin5@example.com",
                name: "Admin User 5",
                password: await bcrypt.hash("admin123", 12),
                role: "ADMIN"
            },
        })

        await prisma.user.create({
            data: {
                email: "admin6@example.com",
                name: "Admin User 6",
                password: await bcrypt.hash("admin123", 12),
                role: "ADMIN"
            },
        })

        console.log('Seed completed successfully')
    } catch (error) {
        console.error('Error during seeding:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    }) 