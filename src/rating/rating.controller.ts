import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { RatingService } from "./rating.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('ratings')
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req, @Body() dto: CreateRatingDto) {
        const userId = req.user.id; // User id from JWT payload
        return this.ratingService.create(userId, dto);
    }
}