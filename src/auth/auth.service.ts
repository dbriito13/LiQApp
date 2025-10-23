import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    private logger = new Logger(AuthService.name);

    
    async register(email: string, password: string, username: string){
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser){
            const errors: Record<string, string> = {};
            if (existingUser?.email === email) errors.email = 'Email is already taken';
            if (existingUser?.username === username) errors.username = 'Username is already taken';
            throw new ConflictException(errors);
        }

        const hashed = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, username, password: hashed },
        });
    }

    async validateUser(email: string, password: string){
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null; // TODO: Add return type email does not exist

        this.logger.log("Found user matching email " + user.email);

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null; // TODO: Add return type password was wrong

        this.logger.log("Password was correct for user with email " + user.email);
        return user;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}