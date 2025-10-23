import { Controller, Post, Body, Get, Render, Redirect, Res, Logger, ConflictException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import e from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @Get('login')
  @Render('login')
  getLogin() { return {}; }
  
  @Get('register')
  @Render('register')
  showRegister() { return { errors: {}}; }


  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(dto.email, dto.password, dto.username);
      return res.redirect('/auth/login');
    } catch (e) {
      if (e instanceof ConflictException) {
        const errors = e.getResponse() as Record<string, string>;
        this.logger.log("Errors:" + JSON.stringify(e.getResponse()));
        return res.render('register', { errors, email: dto.email, username: dto.username })
      }
      throw e;
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      this.logger.log("Invalid Credentials / Email not Found");
      return { error: 'Invalid credentials' };
    } 
    // Generate JWT token
    const token = await this.authService.login(user);

    // Store token in cookie 
    res.cookie('jwt', token.access_token, { httpOnly: true })
    return res.redirect('/')
  }
}
