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

    }catch(error){

    }
}