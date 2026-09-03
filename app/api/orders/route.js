import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";


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

        }
    }catch (error){

    }
}