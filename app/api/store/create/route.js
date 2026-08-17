import { getAuth } from "@clerk/nextjs/server";

// create the stoRE
export async function POST(request){

}try{
    const {userId} = getAuth(request)

    // get the data from the form
    const formData = await request.formData()

    const name = formData.get("name")
    const username = formData.get("username")
    const description = formData.get("description")
    const email = formData.get("email")
    const contact = formData.get("contact")
    const address = formData.get("address")
    const image = formData.get("image")
}catch (error){

}