import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middleware/authSeller";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Toggle stock of a product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { error: "Missing details: product id" },
                { status: 400 }
            );
        }

        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if product belongs to this seller
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                storeId: storeId
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Toggle stock
        const updatedProduct = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                inStock: !product.inStock
            }
        });

        return NextResponse.json({
            message: "Stock status updated successfully",
            inStock: updatedProduct.inStock
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}