import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { log } from 'console';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    private readonly logger = new Logger(ProductService.name);

    async getProductById(id: number){
        const product = await this.prisma.product.findUnique({
            where: { id: id },
            include: {
                ratings: true,
            },
        });

        if (!product) return null;

        const avgRating = product.ratings.length > 0 ? product.ratings.reduce((a, r) => a + r.value, 0) / product.ratings.length : null;

        return { ...product, avgRating };
    }

    async create(dto: CreateProductDto, userId?: string) {
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                producer: dto.producer,
                
            },
        });

        if (dto.rating && userId) {
            await this.prisma.rating.create({
                data: {
                    userId,
                    productId: product.id,
                    value: dto.rating,
                },
            });
        }

        this.logger.log('Successfully created product from DTO: ' + dto.toString());

        return product;
    }
}
