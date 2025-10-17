import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRatingDto) {
    // if user already rated, update instead of creating a new one
    const existing = await this.prisma.rating.findFirst({
      where: { userId, productId: dto.productId },
    });

    if (existing) {
      return this.prisma.rating.update({
        where: { id: existing.id },
        data: { value: dto.value, comment: dto.comment },
      });
    }

    return this.prisma.rating.create({
      data: {
        userId,
        productId: dto.productId,
        value: dto.value,
        comment: dto.comment,
      },
    });
  }
}
