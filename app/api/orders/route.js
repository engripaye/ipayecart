import {getAuth} from "@clerk/nextjs/server";


export async function POST(request) {
    try{
        const { userId, has} = getAuth(request);
        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const { addressId, items, couponCode, paymentMethod} = await request.json();

        // check if all required fields are present
    }catch (error){

    }
}