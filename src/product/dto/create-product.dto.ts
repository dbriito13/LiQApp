import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    producer: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number; 

    toString(): string {
        return `ProductDto { name: ${this.name}, producer: ${this.producer}, rating: ${this.rating ?? 'N/A'} }`;
    }
}