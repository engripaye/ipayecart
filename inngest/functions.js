import { inngest } from './client';
import prisma from '@/lib/prisma';
// ingest function to save user to a database

export const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-create'},
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const {data} = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_address[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,

            }
        })
    }
)


// Ingest function to update user data in database
export const syncUserUpdate = inngest.createFunction(
    {id: 'sync-user-update'},
    {event: 'clerk/user.updated'},
    async ({ event }) => {
        const {data} = event
        await prisma.user.update({
            where: {
                id: data.id,
            },

            data: {
                email: data.email_address[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,

            }
        })
    }
)

// ingest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {id: 'sync-user-delete'},
    {event: 'clerk/user.deleted'},
    async ({ event }) => {
        const {data} = event
        await prisma.user.delete({
            where: {id: data.id}

        })
    }
)