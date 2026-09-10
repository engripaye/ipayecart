import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.redirect(
                new URL("/sign-in?redirect_url=/checkout", request.url)
            );
        }

        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.error("PAYSTACK_SECRET_KEY is not configured");
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        const { searchParams } = new URL(request.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Verify payment directly with Paystack
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok || !result.status) {
            console.error("PAYSTACK VERIFY ERROR:", result);

            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        const transaction = result.data;

        // Paystack transaction itself must be successful
        if (transaction.status !== "success") {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        if (transaction.currency !== "NGN") {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        const metadata = transaction.metadata || {};

        const orderIds = metadata.orderIds;

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Get the orders
        const orders = await prisma.order.findMany({
            where: {
                id: {
                    in: orderIds
                }
            }
        });

        if (orders.length !== orderIds.length) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Make sure the authenticated user owns the orders
        if (orders.some(order => order.userId !== userId)) {
            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Calculate the amount our database expected
        const expectedAmount = Math.round(
            orders.reduce(
                (sum, order) => sum + order.total,
                0
            ) * 100
        );

        // Verify amount
        if (transaction.amount !== expectedAmount) {
            console.error(
                "PAYMENT AMOUNT MISMATCH",
                {
                    paystack: transaction.amount,
                    expected: expectedAmount
                }
            );

            return NextResponse.redirect(
                new URL("/checkout?payment=failed", request.url)
            );
        }

        // Mark all orders as paid
        await prisma.order.updateMany({
            where: {
                id: {
                    in: orderIds
                },
                isPaid: false
            },
            data: {
                isPaid: true
            }
        });

        // Clear the customer's cart only after successful payment
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                cart: {}
            }
        });

        return NextResponse.redirect(
            new URL(
                `/orders?payment=success&reference=${encodeURIComponent(reference)}`,
                request.url
            )
        );

    } catch (error) {
        console.error("PAYSTACK CALLBACK ERROR:", error);

        return NextResponse.redirect(
            new URL("/checkout?payment=failed", request.url)
        );
    }
}
