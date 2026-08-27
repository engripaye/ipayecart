import {getAuth} from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import {NextResponse} from "next/server";


// Approve seller

export async function POST(request){

    try{
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin()

        if(!isAdmin){
            return NextResponse.json({ error: "not authorized"}, {status: 401})
        }
        const {storeId, status} = await request.json()

        if(status === 'approved'){
            await prisma.store.update({
                where: { id: storeId},
                data: { status: "approved", isActive: true}

            })
        }else if(status === 'rejected'){
            await prisma.store.update({
                where: { id: storeId},
                data: { status: "rejected"})
        }

    }catch(error){

    }
}