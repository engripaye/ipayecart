import {NextResponse} from "next/server";


export async function GET(request){
    try{
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
    }catch (error){

    }
}