import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import authSeller from "@/middleware/authSeller";

// update seller order status


export async function POST(request) {
    try{
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }
        const {orderId, status} = await request.json()

        await prisma.order.update({
            where: {
                id: orderId, storeId,
                data: {
                    status
                }
            },
        })
        return NextResponse.json({ message: 'Order status updated successfully' });

    }catch(error){
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });

    }
}

// Get all orders for a seller
export async function GET(request) {
    try{
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                storeId,
            }, include: {
            User: true, address: true, orderItems: {
            include: {
                product: true
            }
            }
            }, orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json({orders})
        }catch (error){
        console.log(error);
        return NextResponse.json({error: error.code || error.message }, { status: 400})

    }
}
