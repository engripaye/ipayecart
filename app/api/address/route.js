import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

// add new address

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
        console.log(error);
        return NextResponse.json({ error: error.message}
            , {status: 400})
    }
}