import {getAuth} from "@clerk/nextjs/server";

// update seller order status


export async function POST(request) {
    try{
        const { userId } = getAuth(request)

    }catch(error){

    }
}