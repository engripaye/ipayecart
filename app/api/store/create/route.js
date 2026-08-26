import { currentUser, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imageKit from "@/configs/imageKit";

// create a store
export async function POST(request) {
    try {
        // Get authenticated Clerk user
        const user = await currentUser();

        // Make sure the user is logged in
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = user.id;

        // Get user information from Clerk
        const clerkEmail = user.emailAddresses[0]?.emailAddress;
        const clerkName = user.firstName
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : "User";
        const clerkImage = user.imageUrl;

        // Make sure required Clerk information exists
        if (!clerkEmail || !clerkImage) {
            return NextResponse.json(
                { error: "User email or image is missing" },
                { status: 400 }
            );
        }

        // Make sure Clerk user exists in Prisma
        await prisma.user.upsert({
            where: {
                id: userId,
            },
            update: {},
            create: {
                id: userId,
                name: clerkName,
                email: clerkEmail,
                image: clerkImage,
            },
        });

        // Get the data from the form
        const formData = await request.formData();

        const name = formData.get("name");
        const username = formData.get("username");
        const description = formData.get("description");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");

        // Validate required fields
        if (
            !name ||
            !username ||
            !description ||
            !email ||
            !contact ||
            !address ||
            !image
        ) {
            return NextResponse.json(
                { error: "missing store information" },
                { status: 400 }
            );
        }

        // Check if user has already registered a store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId,
            },
        });

        // If a store is already registered, send status of store
        if (store) {
            return NextResponse.json({
                status: store.status,
            });
        }

        // Check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase(),
            },
        });

        if (isUsernameTaken) {
            return NextResponse.json(
                { error: "username already taken" },
                { status: 400 }
            );
        }

        // Image upload to ImageKit
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

        // Create the store
        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                username: username.toLowerCase(),
                description,
                email,
                contact,
                address,
                logo: optimizedImage,
            },
        });

        // Link store to user
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                store: {
                    connect: {
                        id: newStore.id,
                    },
                },
            },
        });

        // Store creation confirmation
        return NextResponse.json({
            message: "applied, waiting for approval",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: error.code || error.message,
            },
            { status: 400 }
        );
    }
}

// Check if user has already registered a store
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // Make sure the user is logged in
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user has already registered a store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId,
            },
        });

        // If a store is already registered, send status of store
        if (store) {
            return NextResponse.json({
                status: store.status,
            });
        }

        return NextResponse.json({
            status: "not registered",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: error.code || error.message,
            },
            { status: 400 }
        );
    }
}