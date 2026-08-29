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
        const { data } = event;

        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_address[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
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
        const { data } = event;

        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email: data.email_address[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            },
        });
    }
);

// Sync deleted Clerk users from the database
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

// Inngest function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
    {id: 'delete-coupon-on-expiry'},
    {event: 'app/coupon.expired'},
    async ({event, step }) => {
        const { data } = event
        const expiryDate = new Date(data.expires_at)
        await step.sleepUntil('wait-for-expiry', expiryDate)

        await step.run('delete-coupon-from-database', async () =>{
            await prisma.coupon.delete({
                where: { code: data.code }
            })
        })
    }

)