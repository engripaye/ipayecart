export async function GET(request){
    try{
        let products = await prisma.product.findMany({
            where: {
                inStock: true
            }, include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true,
                        user: {
                            select: {
                                name: true, image: true
                            }
                        }
                    }
                }
            }
        })
    }catch (error){

    }
}