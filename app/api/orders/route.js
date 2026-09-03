import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId, has } = getAuth(request);

        // Check authentication
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            addressId,
            items,
            couponCode,
            paymentMethod
        } = await request.json();

        // Check required fields
        if (
            !addressId ||
            !paymentMethod ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return NextResponse.json(
                { error: "Missing order details" },
                { status: 400 }
            );
        }

        // ----------------------------------------
        // VERIFY COUPON
        // ----------------------------------------

        let coupon = null;

        if (couponCode) {
            const normalizedCouponCode = couponCode.trim().toUpperCase();

            coupon = await prisma.coupon.findFirst({
                where: {
                    code: normalizedCouponCode,
                    expiresAt: {
                        gt: new Date()
                    }
                }
            });

            if (!coupon) {
                return NextResponse.json(
                    { error: "Coupon not found or expired" },
                    { status: 400 }
                );
            }

            // Check new-user coupon
            if (coupon.forNewUser) {
                const userOrders = await prisma.order.findMany({
                    where: {
                        userId
                    }
                });

                if (userOrders.length > 0) {
                    return NextResponse.json(
                        {
                            error: "Coupon valid for new users only"
                        },
                        { status: 400 }
                    );
                }
            }

            // Check Plus-member coupon
            if (coupon.forMember) {
                const isPlusMember = has({ plan: "plus" });

                if (!isPlusMember) {
                    return NextResponse.json(
                        {
                            error: "Coupon valid for Plus members only"
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // ----------------------------------------
        // CHECK PLUS MEMBERSHIP
        // ----------------------------------------

        const isPlusMember = has({ plan: "plus" });

        // ----------------------------------------
        // GROUP ITEMS BY STORE
        // ----------------------------------------

        const ordersByStore = new Map();

        for (const item of items) {

            const product = await prisma.product.findUnique({
                where: {
                    id: item.id
                }
            });

            if (!product) {
                return NextResponse.json(
                    {
                        error: `Product not found: ${item.id}`
                    },
                    { status: 404 }
                );
            }

            if (!item.quantity || item.quantity < 1) {
                return NextResponse.json(
                    {
                        error: "Invalid product quantity"
                    },
                    { status: 400 }
                );
            }

            const storeId = product.storeId;

            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, []);
            }

            ordersByStore.get(storeId).push({
                ...item,
                price: product.price
            });
        }

        // ----------------------------------------
        // CREATE ORDERS
        // ----------------------------------------

        const orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false;

        for (const [storeId, storeItems] of ordersByStore.entries()) {

            // Calculate seller subtotal
            let total = storeItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            // Apply coupon discount
            if (coupon) {
                total -= (total * coupon.discount) / 100;
            }

            // Free shipping for Plus members
            // Otherwise add $5 shipping once
            if (!isPlusMember && !isShippingFeeAdded) {
                total += 5;
                isShippingFeeAdded = true;
            }

            total = parseFloat(total.toFixed(2));

            fullAmount += total;

            // Create order
            const order = await prisma.order.create({
                data: {
                    userId,
                    storeId,
                    addressId,
                    total,
                    paymentMethod,

                    isCouponUsed: !!coupon,

                    coupon: coupon
                        ? {
                            code: coupon.code,
                            discount: coupon.discount,
                            description: coupon.description
                        }
                        : {},

                    orderItems: {
                        create: storeItems.map((item) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            orderIds.push(order.id);
        }

        // ----------------------------------------
        // CLEAR CART
        // ----------------------------------------

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                cart: {}
            }
        });

        return NextResponse.json({
            message: "Order placed successfully",
            orderIds,
            total: fullAmount
        });

    } catch (error) {
        console.error("ORDER ERROR:", error);

        return NextResponse.json(
            {
                error: error.code || error.message
            },
            { status: 400 }
        );
    }
}


// ============================================
// GET ALL ORDERS FOR CURRENT USER
// ============================================

export async function GET(request) {
    try {

        const { userId } = getAuth(request);

        // Check authentication
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                userId,

                OR: [
                    {
                        paymentMethod: "COD"
                    },
                    {
                        paymentMethod: "STRIPE",
                        isPaid: true
                    }
                ]
            },

            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },

                address: true
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            orders
        });

    } catch (error) {

        console.error("GET ORDERS ERROR:", error);

        return NextResponse.json(
            {
                error: error.code || error.message
            },
            { status: 400 }
        );
    }
}