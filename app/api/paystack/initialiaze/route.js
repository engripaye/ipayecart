import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function POST(request) {
    try{
        const { userId } = getAuth(request)

        if(!userId){
            return NextResponse.json({ error: 'not authorized' },
                { status: 401 });
        }



    }catch (error){

    }
}