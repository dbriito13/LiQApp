import { Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from '@nestjs/jwt';



@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy]
})
export class AuthModule {}