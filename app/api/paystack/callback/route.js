import {NextResponse} from "next/server";


export async function GET(request){
    try{
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // verify transaction with paystack
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );
    }catch (error){

    }
}