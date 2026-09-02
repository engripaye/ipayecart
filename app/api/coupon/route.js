import {useAuth} from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

// verify coupon


export async function POST(request) {
    try {
        const {userId, has} = useAuth(request)
        const {code} = await request.json()

        const coupon = await prisma.coupon.findUnique({
            where: {
                code: code.toUpperCase(),
                expiresAt: {gt: new Date()}
            }
        })
        if (!coupon) {
            return NextResponse.json({error: "Coupon no found"}, {status: 404})
        }
        if (coupon.forNewUser) {
            const userOrders = await prisma.order.findMany({
                where: {userId}
            })
            if (userOrders.length > 0) {
                return NextResponse.json({error: "Coupon valid for new users"}, {status: 400})
            }
        }

        if(coupon.forMember){
        const has
    }

    }catch (error){
}