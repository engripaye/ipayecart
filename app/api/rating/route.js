import {getAuth} from "@clerk/nextjs/server";

// Add new rating


export async function POST(request) {
    try{
        const { userId } = getAuth(request)
    }catch (error) {

    }
}