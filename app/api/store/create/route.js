import { getAuth } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

// create a storee
export async function POST(request) {

    try {

        // Get Authenticated user
        const {userId} = getAuth(request)

        // Make sure the use is logged in
        if (!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // get the data from the form
        const formData = await request.formData()

        const name = formData.get("name")
        const username = formData.get("username")
        const description = formData.get("description")
        const email = formData.get("email")
        const contact = formData.get("contact")
        const address = formData.get("address")
        const image = formData.get("image")

        // Validate required fieLd
        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({error: "missing store information"}, {status: 400})
        }


        // check if user has already registered a store
        const store = await prisma.store.findfirst({
            where: {userId: userId}
        })

        // if a store is already registered then send status of store
        if (store) {
            return NextResponse.json({
                status: store.status
            })
        }

        // check if username is already taken
        const isUsernameTaken = await prisma.store.findfirst({
            where: {
                username: username.toLowerCase(),
            },
        })

        if (isUsernameTaken) {
            return NextResponse.json({error: "username already taken"}, {staus: 400})
        }

        // store creation confirmation after images uploaded is effected
        return NextResponse.json({
            message: "Store Validation Successful!",
        })
    } catch (error) {
        console.error("Create store error", error);

        return NextResponse.json({
                error: "Something went wrong"
            }, {status: 500}
        )

    }
}