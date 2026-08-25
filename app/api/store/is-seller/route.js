// Auth Seller
import {getAuth} from "@clerk/nextjs/server";
import authSeller from "@/middleware/authSeller";
import {NextResponse} from "next/server";
import {error} from "next/dist/build/output/log";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);\

        if(!isSeller) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeInfo = await prisma.store.findUnique({
            where: {userId}})

        return NextResponse.json({ isSeller, storeInfo})

    } catch (error) {

    }
}