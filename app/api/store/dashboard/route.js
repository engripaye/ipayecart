import {NextResponse} from "next/server";
import {getAuth} from "@clerk/nextjs/server";
import authSeller from "@/middleware/authSeller";

// get dashboard data for the seller



export async function GET(request){
    try{
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        // get all orders
        const orders = await prisma.order.findMany({where: {storeId}})

        // get all product with rating
        const products = await prisma.product.findMany({where: {storeId}})

        const ratings = await prisma.rating.findMany({
            where: {productId: {in: products.map(product => product.id)}},
            include: {user: true, product: true}
        })

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
            totalProducts: products.length
        }

        return NextResponse.json({ dashboardData });

    }catch (error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}