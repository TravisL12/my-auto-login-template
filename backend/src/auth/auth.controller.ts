import { Controller, Post, Body, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);

    // Set cookies
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    // Return user data without tokens
    return {
      user: result.user,
      message: 'Registration successful',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set cookies
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    // Return user data without tokens
    return {
      user: result.user,
      message: 'Login successful',
    };
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user as { userId: string; refreshToken: string };
    const tokens = await this.authService.refreshTokens(user.userId, user.refreshToken);

    // Set new cookies
    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @Post('logout')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user as { userId: string };
    await this.authService.logout(user.userId);

    // Clear cookies
    this.clearAuthCookies(response);

    return {
      message: 'Logged out successfully',
    };
  }

  private setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    // Set access token cookie
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set refresh token cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('accessToken', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
