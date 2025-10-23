// src/common/middleware/auth-template.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;
    if (!token) {
      res.locals.user = null;
      return next();
    }

    try {
      const payload = this.jwtService.verify(token);
      res.locals.user = { id: payload.sub, email: payload.email };
    } catch (e) {
      this.logger.debug('Invalid token');
      res.locals.user = null;
    }

    next();
  }
}
