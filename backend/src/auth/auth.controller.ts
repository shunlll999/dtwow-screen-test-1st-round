import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import type { JwtPayload } from './types/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  adminOnly(@CurrentUser() user: JwtPayload) {
    return {
      message: `Welcome, admin ${user.email}`,
    };
  }
}
