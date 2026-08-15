import { inngest } from "./client";
import prisma from "@/lib/prisma";

// Sync newly created Clerk users to the database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-create",
        triggers: {
            event: "clerk/user.created",
        },
    },
    async ({ event }) => {
        const data = event.data;

        if (!data?.id) {
            throw new Error("Clerk user data is missing");
        }

        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
            throw new Error(
                `No email address found for Clerk user ${data.id}`
            );
        }

        const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

        await prisma.user.create({
            data: {
                id: data.id,
                email,
                name,
                image: data.image_url ?? null,
            },
        });
    }
);

// Sync updated Clerk users to the database
export const syncUserUpdate = inngest.createFunction(
    {
        id: "sync-user-update",
        triggers: {
            event: "clerk/user.updated",
        },
    },
    async ({ event }) => {
        const data = event.data;

        if (!data?.id) {
            throw new Error("Clerk user data is missing");
        }

        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
            throw new Error("Clerk user email is missing");
        }

        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email,
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image: data.image_url ?? null,
            },
        });

        return {
            success: true,
            userId: data.id,
        };
    }
);

// Delete Clerk users from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "sync-user-delete",
        triggers: {
            event: "clerk/user.deleted",
        },
    },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.delete({
            where: {
                id: data.id,
            },
        });
    }
);