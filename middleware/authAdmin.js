const {clerkClient} = require("@clerk/nextjs/server");
const authAdmin = async (userId) => {
    try {
        if(!userId) return false

        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        return process.env.ADMIN_EMAIL.split(',').includes(user.emailAddresses[0].emailAddress)

    }catch(error){
        console.error(error)
        return false
    }
}