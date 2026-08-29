import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// add new coupon

export async function POST(request){

    try {

        const { userId } = getAuth()
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {stataus: 401})
        }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data:coupon})

        return NextResponse.json({message: "coupon added successfully"})



    }catch(error){

        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})

    }
}

// delete coupon /api/coupon?id=couponId
export async function DELETE(request){
    try{
        const { userId } = getAuth()
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {stataus: 401})
        }
        const { searchParams } = request.NextUrl;
        const code = searchParams.get('code')

        await prisma.coupon.delete({where: { code }})
        return NextResponse.json({ message: 'Coupon deleted successfully'})
    }catch (error){
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}

// get all coupons
export async function GET(request){
    try{
        const { userId } = getAuth()
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {stataus: 401})
        }

        const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({coupons})
    }catch (error){
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}