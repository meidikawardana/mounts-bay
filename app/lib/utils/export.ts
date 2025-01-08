import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

interface Order {
    id: string
    product: {
        name: string
        price: number
    }
    quantity: number
    status: string
    deliveryDate: string
    address: string
    createdAt: string
}

export const exportToExcel = (orders: Order[], fileName: string = 'orders') => {
    const worksheet = XLSX.utils.json_to_sheet(
        orders.map(order => ({
            'Order ID': order.id,
            'Product': order.product.name,
            'Quantity': order.quantity,
            'Total Price': (order.quantity * order.product.price).toFixed(2),
            'Status': order.status,
            'Delivery Date': new Date(order.deliveryDate).toLocaleDateString(),
            'Address': order.address,
            'Order Date': new Date(order.createdAt).toLocaleDateString()
        }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, `${fileName}.xlsx`)
}

export const exportToCSV = (orders: Order[], fileName: string = 'orders') => {
    const headers = ['Order ID,Product,Quantity,Total Price,Status,Delivery Date,Address,Order Date']
    const csv = orders.map(order => [
        order.id,
        `"${order.product.name}"`,
        order.quantity,
        (order.quantity * order.product.price).toFixed(2),
        order.status,
        new Date(order.deliveryDate).toLocaleDateString(),
        `"${order.address}"`,
        new Date(order.createdAt).toLocaleDateString()
    ].join(','))

    const csvContent = [...headers, ...csv].join('\n')
    const data = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    saveAs(data, `${fileName}.csv`)
} 