import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async getProductById(id: string){
        const product = await this.prisma.product.findUnique({
            where: { id: BigInt(id) }, 
            include: {
                ratings: true,
            },
        });

        if (!product) return null;

        const avgRating = product.ratings.length > 0 ? product.ratings.reduce((a, r) => a + r.value, 0) / product.ratings.length : null;

        return { ...product, avgRating };
    }
}
