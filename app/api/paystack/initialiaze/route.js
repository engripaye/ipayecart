import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function POST(request) {
    try{
        const { userId } = getAuth(request)

        if(!userId){
            return NextResponse.json({ error: 'not authorized' },
                { status: 401 });
        }

        const { email, amount, orderId } = await request.json()
        if(!email || !amount || !orderId){
                return NextResponse.json({ error: 'missing required fields' },
                    { status: 400 });
            }

        // Make sure the order belongs to the logged-in user
        const order = await prisma.order.findUnique({
            where: { id: orderId, userId }
        });
        if(!order){
            return NextResponse.json({ error: 'Order not found' },
                { status: 404 });
        }
    }catch (error){

    }
}