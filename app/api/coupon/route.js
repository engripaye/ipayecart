import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId, has } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Coupon code is required" },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.findFirst({
            where: {
                code: code.toUpperCase(),
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!coupon) {
            return NextResponse.json(
                { error: "Coupon not found or expired" },
                { status: 404 }
            );
        }

        // New-user coupon
        if (coupon.forNewUser) {
            const userOrders = await prisma.order.findMany({
                where: {
                    userId,
                },
            });

            if (userOrders.length > 0) {
                return NextResponse.json(
                    { error: "Coupon valid for new users only" },
                    { status: 400 }
                );
            }
        }

        // Plus-member coupon
        if (coupon.forMember) {
            const hasPlusPlan = has({ plan: "plus" });

            if (!hasPlusPlan) {
                return NextResponse.json(
                    { error: "Coupon valid for Plus members only" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json({
            coupon,
        });

    } catch (error) {
        console.error("Coupon verification error:", error);

        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}