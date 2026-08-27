import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";

// get all approved stores
export async function GET(request){

    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: {status: {in: ["pending", "rejected"]}},
            include: {user: true}
        })

        return NextResponse.json({stores})
    }catch(error){

        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, {status: 400})
    }
}