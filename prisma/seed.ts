import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
    // Electronics (5 items)
    {
        name: "4K Ultra HD Smart TV",
        description: "55-inch 4K Smart TV with HDR and built-in streaming apps",
        price: 699.99,
        stock: 50,
        category: "Electronics"
    },
    {
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation",
        price: 249.99,
        stock: 75,
        category: "Electronics"
    },
    {
        name: "Professional Laptop",
        description: "15.6-inch laptop with latest gen processor and 16GB RAM",
        price: 1299.99,
        stock: 30,
        category: "Electronics"
    },
    {
        name: "Smart Watch Series 5",
        description: "Advanced fitness tracking and health monitoring smartwatch",
        price: 299.99,
        stock: 100,
        category: "Electronics"
    },
    {
        name: "Wireless Gaming Mouse",
        description: "High-precision gaming mouse with programmable buttons",
        price: 79.99,
        stock: 120,
        category: "Electronics"
    },

    // Clothing (5 items)
    {
        name: "Classic Denim Jeans",
        description: "Comfortable straight-fit jeans in dark wash",
        price: 59.99,
        stock: 150,
        category: "Clothing"
    },
    {
        name: "Cotton T-Shirt",
        description: "Basic crew neck t-shirt in various colors",
        price: 19.99,
        stock: 200,
        category: "Clothing"
    },
    {
        name: "Wool Sweater",
        description: "Warm knit sweater for winter",
        price: 79.99,
        stock: 80,
        category: "Clothing"
    },
    {
        name: "Athletic Shorts",
        description: "Lightweight running shorts with pockets",
        price: 29.99,
        stock: 120,
        category: "Clothing"
    },
    {
        name: "Formal Dress Shirt",
        description: "Wrinkle-resistant button-up shirt",
        price: 49.99,
        stock: 90,
        category: "Clothing"
    },

    // Books (5 items)
    {
        name: "The Art of Programming",
        description: "Comprehensive guide to software development",
        price: 49.99,
        stock: 60,
        category: "Books"
    },
    {
        name: "Modern Cooking Essentials",
        description: "Collection of contemporary recipes",
        price: 34.99,
        stock: 85,
        category: "Books"
    },
    {
        name: "World History: A New Perspective",
        description: "Detailed exploration of world history",
        price: 39.99,
        stock: 70,
        category: "Books"
    },
    {
        name: "Financial Freedom Guide",
        description: "Personal finance and investment strategies",
        price: 29.99,
        stock: 100,
        category: "Books"
    },
    {
        name: "Science of Everyday Life",
        description: "Scientific explanations of daily phenomena",
        price: 24.99,
        stock: 90,
        category: "Books"
    },

    // Home & Garden (5 items)
    {
        name: "Garden Tool Set",
        description: "Complete set of essential gardening tools",
        price: 49.99,
        stock: 60,
        category: "Home & Garden"
    },
    {
        name: "Indoor Plant Collection",
        description: "Set of 3 low-maintenance indoor plants",
        price: 39.99,
        stock: 45,
        category: "Home & Garden"
    },
    {
        name: "Automatic Plant Watering System",
        description: "Smart watering system for indoor plants",
        price: 29.99,
        stock: 75,
        category: "Home & Garden"
    },
    {
        name: "Decorative Throw Pillows",
        description: "Set of 2 modern design throw pillows",
        price: 34.99,
        stock: 100,
        category: "Home & Garden"
    },
    {
        name: "LED Grow Light",
        description: "Adjustable LED light for indoor plants",
        price: 59.99,
        stock: 50,
        category: "Home & Garden"
    },

    // Sports & Outdoors (5 items)
    {
        name: "Yoga Mat",
        description: "Non-slip exercise yoga mat with carrying strap",
        price: 29.99,
        stock: 100,
        category: "Sports & Outdoors"
    },
    {
        name: "Resistance Bands Set",
        description: "Set of 5 exercise bands with different resistance levels",
        price: 24.99,
        stock: 150,
        category: "Sports & Outdoors"
    },
    {
        name: "Basketball",
        description: "Official size indoor/outdoor basketball",
        price: 29.99,
        stock: 80,
        category: "Sports & Outdoors"
    },
    {
        name: "Tennis Racket",
        description: "Professional tennis racket with cover",
        price: 89.99,
        stock: 45,
        category: "Sports & Outdoors"
    },
    {
        name: "Hiking Backpack",
        description: "35L waterproof hiking backpack",
        price: 69.99,
        stock: 60,
        category: "Sports & Outdoors"
    },

    // Total: 25 items (5 in each category)
]

// Helper function to get random date within the last 30 days
const getRandomRecentDate = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
}

// Helper function to get delivery date (7-14 days from order date)
const getDeliveryDate = (orderDate: Date): Date => {
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
        await Promise.all([
            prisma.user.insert({
                where: { email: 'admin@example.com' },
                update: {},
                create: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: await bcrypt.hash('admin123', 10),
                    role: 'ADMIN'
                }
            }),
        ])

        // // Create products
        // console.log('Creating products...')
        // const createdProducts = await prisma.product.createMany({
        //     data: products
        // })
        // console.log(`Created ${createdProducts.count} products`)

        // // Get all users and products for creating orders
        // const users = await prisma.user.findMany({
        //     select: { id: true },
        // })
        // const allProducts = await prisma.product.findMany({
        //     select: { id: true },
        // })

        // if (users.length === 0) {
        //     throw new Error('No users found in the database. Please create users first.')
        // }

        // // Create orders
        // console.log('Creating orders...')
        // const orders = createOrders(
        //     users.map((user: { id: string }) => user.id),
        //     allProducts.map((product: { id: string }) => product.id)
        // )

        // for (const order of orders) {
        //     await prisma.order.create({
        //         data: {
        //             ...order,
        //             status: order.status as 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
        //         }
        //     })
        //     console.log('Created 1 order')
        // }

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