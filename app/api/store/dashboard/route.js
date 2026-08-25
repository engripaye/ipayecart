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
    }catch (error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}