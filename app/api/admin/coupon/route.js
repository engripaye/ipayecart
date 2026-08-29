import { auth } from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Add new coupon
export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
        }

        const { coupon } = await request.json();

        coupon.code = coupon.code.toUpperCase();

        await prisma.coupon.create({
            data: coupon,
        });

        return NextResponse.json({
            message: "Coupon added successfully",
        });

    } catch (error) {
        console.error("Coupon POST error:", error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}

// Delete coupon
// /api/admin/coupon?code=COUPON_CODE
export async function DELETE(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { error: "Coupon code is required" },
                { status: 400 }
            );
        }

        await prisma.coupon.delete({
            where: {
                code,
            },
        });

        return NextResponse.json({
            message: "Coupon deleted successfully",
        });

    } catch (error) {
        console.error("Coupon DELETE error:", error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}

// Get all coupons
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
        }

        const coupons = await prisma.coupon.findMany({});

        return NextResponse.json({
            coupons,
        });

    } catch (error) {
        console.error("Coupon GET error:", error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}