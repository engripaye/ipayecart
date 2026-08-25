

// Get store info and products

export async function GET(request) {
    try{
        // get username from query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
    }catch (error) {

    }
}