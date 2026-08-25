

// Get store info and products

import {NextResponse} from "next/server";

export async function GET(request) {
    try{
        // get username from query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username").toLowerCase();

        if (!username) {
            return NextResponse.json({ error: "Missing username" }, { status: 400 });
        }

        // Get store info
        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: { Product: { include: { rating: true}}}
        })

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 400 });
        }

        return NextResponse.json({ store }, { status: 200 });
    }catch (error) {

    }
}