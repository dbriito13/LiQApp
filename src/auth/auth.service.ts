import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    
    async register(email: string, password: string, name: string){
        const hashed = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hashed, name },
        });
    }

    async validateUser(email: string, password: string){
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null; // TODO: Add return type email does not exist

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null; // TODO: Add return type password was wrong

        return user;
        
    }

}