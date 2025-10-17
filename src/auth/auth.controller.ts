import { Controller, Post, Body, Get, Render, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  getLogin() { return {}; }
  
  @Get('register')
  @Render('register')
  showRegister() { return {}; }


  @Post('register')
  @Redirect('/auth/login')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) return { error: 'Invalid credentials' };
    return res.redirect('/')
  }
}
