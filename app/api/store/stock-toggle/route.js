

// toggle stock of a product
import {getAuth} from "@clerk/nextjs/server";
import authSeller from "@/middleware/authSeller";
import {NextResponse} from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { productId } = await request.json();

        if(!productId){
            return NextResponse.json({ error: "Missing details: product id" }, { status: 400 });
        }

        const storeId = await authSeller(userId);

        if(!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // check if product exists
        const product = await prisma.product.findUnique({
    }catch (error) {

    }
}