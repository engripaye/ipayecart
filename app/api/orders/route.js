import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request) {
    try{
        const { userId, has} = getAuth(request);
        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const { addressId, items, couponCode, paymentMethod} = await request.json();

        // check if all required fields are present
        if(!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0){
            return NextResponse.json({error: "missing order details"}, {status: 401})
        }

        let coupon = null;

        if(couponCode){
            coupon = await prisma.coupon.findFirst({
                where: { code: couponCode },
            });

            if (!coupon) {
                return NextResponse.json(
                    { error: "Coupon not found or expired" },
                    { status: 400 }
                );
            }
        }


        // check if coupon is applicable for new users
        if (couponCode && coupon.forNewUser) {
            const userOrders = await prisma.order.findMany({
                where: {
                    userId,
                },
            });
            if (userOrders.length > 0) {
                return NextResponse.json(
                    { error: "Coupon valid for new users only" },
                    { status: 400 }
                );
            }
        }


        if (coupon.forMember) {
            const hasPlusPlan = has({ plan: "plus" });

            if (!hasPlusPlan) {
                return NextResponse.json(
                    { error: "Coupon valid for Plus members only" },
                    { status: 400 }
                );
            }
        }
    }catch (error){

    }
}