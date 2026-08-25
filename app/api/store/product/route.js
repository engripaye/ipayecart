import {getAuth} from "@clerk/nextjs/server";

// Add a new product
 export async function POST(request) {
    try {
        const { userId } = getAuth(request);


    }catch (error) {

    }
 }