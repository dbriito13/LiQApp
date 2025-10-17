import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
