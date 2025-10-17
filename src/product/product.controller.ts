import { Controller, Get, Param, Render } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get(':id')
    @Render('product')
    async getProduct(@Param('id') id: string){
        const product = await this.productService.getProductById(id);
        if (!product) return { error: 'Product not found' };
        return { product };
    }
}
