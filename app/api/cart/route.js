import {getAuth} from "@clerk/nextjs/server";


// update user cart
export async function POST(request){
    try{
        const { userId } = getAuth(request)
        const { cart } = await request.json()

        // save the cart to the user object
        await
    }catch(error){

    }
}