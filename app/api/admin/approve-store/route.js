import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";


// Approve seller

export async function POST(request){

    try{
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin()

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {status: 401})
        }

    }catch(error){

    }
}