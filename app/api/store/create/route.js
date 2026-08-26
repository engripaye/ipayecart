import { getAuth } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import imageKit from "@/configs/imageKit";

// create a store
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
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })

        // if a store is already registered then send status of store
        if (store) {
            return NextResponse.json({
                status: store.status
            })
        }

        // check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase(),
            },
        })

        if (isUsernameTaken) {
            return NextResponse.json({error: "username already taken"}, {staus: 400})
        }

        // image upload to ImageKit
        const buffer = Buffer.from(await image.arrayBuffer());

        const response = await imageKit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos",
        });

        const optimizedImage = imageKit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { height: "512" },
            ],
        });

        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage
            }
        })

        // link store to user
        await prisma.user.update({
            where: {id: userId},
            data: {store: {connect: {id: newStore.id}}}
        })

        // store creation confirmation after images uploaded is effected
        return NextResponse.json({
            message: "applied, waiting for approval",
        })
    } catch (error) {
        console.error(error);

        return NextResponse.json({
                error: error.code || error.message
            }, {status: 400})

    }
}

// check if user have already registered a store
export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        // check if user has already registered a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })

        // if a store is already registered then send status of store
        if (store) {
            return NextResponse.json({
                status: store.status
            })
        }

        return NextResponse.json({
            status: "not registered"
        })
    }catch (error) {
        console.error(error);
        return NextResponse.json({
            error: error.code || error.message
        }, {status: 400})
    }
}