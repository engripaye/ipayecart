

export async function GET(request){
    try{
        const { searchParams } = new URL(request.url);
        const refrence = searchParams.get("reference");
    }catch (error){

    }
}