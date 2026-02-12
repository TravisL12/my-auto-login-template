import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request) {
    const user = request.user as { userId: string; email: string };
    const profile = await this.usersService.findById(user.userId);

    return {
      user: profile,
    };
  }
}
