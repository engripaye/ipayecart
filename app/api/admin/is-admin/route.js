import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// auth Admin
export async function GET(request){
    try{
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId)

        if(!isAdmin) {
            return NextResponse.json({error: "Not Authorized"}, {status: 401})

        }
        return NextResponse.json({isAdmin})


        }catch (error){
            console.log(error);
            return NextResponse.json({ error: error.code || error.message}, {status: 400})

    }
}