import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";


// update user cart
export async function POST(request){
    try{
        const { userId } = getAuth(request)
        const { cart } = await request.json()

        // save the cart to the user object
        await prisma.user.update ({
            where: {
                id: userId
            }, data: { cart: cart}
        })
        return NextResponse.json({
            message: "cart updated"
        })
    }catch(error){

    }
}

// Get user cart
export async function GET(request){
    try{
        const { userId } = getAuth(request)
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        return NextResponse.json({
            cart: user.cart
        })
    }catch(error){
        console

    }
}