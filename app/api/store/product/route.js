import {getAuth} from "@clerk/nextjs/server";
import authSeller from "@/middleware/authSeller";

// Add a new product
 export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if(!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the data form
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = formData.get("name");
        const price = formData.get("price");
        const category = formData.get("category");
        const image = formData.get("image");

    }catch (error) {

    }
 }