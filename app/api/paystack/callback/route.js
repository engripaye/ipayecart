import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

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

        const data = await response.json();

        if(!response.ok || !data.status){
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        const transaction = data.data;
        // if payment was not successful
        if(transaction.status !== "success"){
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Extract order ID from our reference
        // IPAYE-orderId-timestamp
        const part = reference.split("-");

        const orderId = part[1];

        if(!orderId){
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        const order = await prisma.order.findUnique({
            where : {
                id: orderId
            }
        });

        if(!order){
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // prevent processing the same payment twice
        if(!order.isPaid){

            // verify that amount
            const expectedAmount = Math.round(Number(order.total) * 100);

            if (Number(transaction.amount) !== expectedAmount){
                console.error("Payment amount mismatch");

                return NextResponse.redirect(
                    new URL("/checkout?payment=failed", request.url)
                );
            }

            await prisma.order.update({
                where: {
                    id: order.id
                }, data: {
                    isPaid: true
                }
            })
        }





    }catch (error){

    }
}