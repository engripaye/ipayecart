import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { orderIds } = await request.json();

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json(
                { error: "Order IDs are required" },
                { status: 400 }
            );
        }

        // Get the orders belonging to this user
        const orders = await prisma.order.findMany({
            where: {
                id: {
                    in: orderIds
                },
                userId,
                paymentMethod: "PAYSTACK",
                isPaid: false
            }
        });

        if (orders.length !== orderIds.length) {
            return NextResponse.json(
                { error: "Invalid or unauthorized orders" },
                { status: 403 }
            );
        }

        const total = orders.reduce(
            (sum, order) => sum + order.total,
            0
        );

        const amountInKobo = Math.round(total * 100);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const reference = `IPAYE-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;

        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000";

        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    amount: amountInKobo,
                    currency: "NGN",
                    reference,
                    callback_url: `${baseUrl}/api/paystack/callback`,
                    metadata: {
                        userId,
                        orderIds
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.status) {
            console.error("PAYSTACK INITIALIZATION ERROR:", data);

            return NextResponse.json(
                {
                    error:
                        data.message ||
                        "Unable to initialize Paystack payment"
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            authorization_url: data.data.authorization_url,
            reference: data.data.reference
        });

    } catch (error) {
        console.error("PAYSTACK INITIALIZE ERROR:", error);

        return NextResponse.json(
            {
                error: error.message
            },
            { status: 500 }
        );
    }
}