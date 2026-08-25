import {NextResponse} from "next/server";
import {getAuth} from "@clerk/nextjs/server";

// get dashboard data for the seller



export async function GET(request){
    try{
        const { userId } = getAuth()
    }catch (error){
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}