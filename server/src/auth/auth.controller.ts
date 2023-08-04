import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  signIn(@Body() signInDto: CreateAuthDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signUp')
  signUp(@Body() signInDto: CreateAuthDto) {
    return this.authService.signUp(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Req() request: Request) {
    return this.authService.getProfile(request);
  }

}
