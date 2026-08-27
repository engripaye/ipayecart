import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// Get dashboard data for admin

export async function GET(request){
    const { userId } = getAuth(request)
    const isAdmin = await  authAdmin(userId)

    if(isAdmin){
        return NextResponse.json({ error: 'not authorized'}, { status: 401 });
    }

    // get total orders
    const orders = await prisma.order.count()

    // get total stores on app
    const stores = await prisma.store.count()

    // get all orders including total revenue
    const allOrders = await prisma.order.findMany({
        select: {
            createdAt: true,
            total: true,

        }
    })

    let totalRevenue = 0
    allOrders.forEach(order => {
        totalRevenue += order.total
    })

}

