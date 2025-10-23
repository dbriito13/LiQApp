import { Body, Controller, Get, Param, Post, Query, Render, UseGuards, Request, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    private readonly logger = new Logger(ProductController.name);

    @Get('create')
    @Render('product-create')
    @UseGuards(JwtAuthGuard)
    async getCreatePage() { 
        this.logger.log("Accessed product creation page");
        return {}; }

    @Get(':id')
    @Render('product')
    async getProduct(@Param('id') id: number){
        const product = await this.productService.getProductById(id);
        if (!product) return { error: 'Product not found' };
        return { product };
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@Request() req, @Body() dto: CreateProductDto) {
        const userId = req.user.userId;
        this.logger.error("User " + userId + "attempting to create product with DTO "+ dto.toString());
        return this.productService.create(dto, userId);
    }
}
