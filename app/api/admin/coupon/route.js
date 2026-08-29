import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// add new coupon

export async function POST(request){

    try {

        const { userId } = getAuth()
        const isAdmin = await authAdmin()

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {stataus: 401})
        }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data:coupon})

        return NextResponse.json({message: "coupon added successfully"})



    }catch(error){

        console.error(error)
        return NextResponse.json({})

    }
}