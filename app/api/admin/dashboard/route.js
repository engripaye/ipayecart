import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// Get dashboard data for admin

export async function GET(request){

    try{
        const { userId } = getAuth(request)
        const isAdmin = await  authAdmin(userId)

        if(!isAdmin){
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

        const revenue = totalRevenue.toFixed(2)

        // total products o app

        const products = await prisma.product.count()
        const dashboardData = {
            orders,
            stores,
            products,
            revenue,
            allOrders
        }

        return NextResponse.json({dashboardData})
    }catch (error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, {status: 400})
    }

}

