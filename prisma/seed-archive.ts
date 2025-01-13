import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // // Delete existing data
    // await prisma.order.deleteMany()
    // await prisma.product.deleteMany()
    // await prisma.user.deleteMany()

    // Create admin user
    await prisma.user.create({
        data: {
            email: "admin3@example.com",
            name: "Admin User 3",
            password: await bcrypt.hash("admin123", 12),
            role: "ADMIN"
        },
    })

    // // Create products
    // await prisma.product.createMany({
    //     data: [
    //         {
    //             name: "Product 1",
    //             price: 99.99,
    //             stock: 100,
    //             category: "Category 1"
    //         },
    //         {
    //             name: "Product 2",
    //             price: 149.99,
    //             stock: 50,
    //             category: "Category 2"
    //         },
    //         {
    //             name: "Product 3",
    //             price: 199.99,
    //             stock: 25,
    //             category: "Category 3"
    //         }
    //     ]
    // })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 