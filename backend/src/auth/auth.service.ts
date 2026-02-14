import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema/user.schema';
import { eq } from 'drizzle-orm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Check if user already exists
    const existingUserByEmail = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUserByUsername.length > 0) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await this.hashData(password);

    // Create user
    const [newUser] = await this.databaseService.db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
      })
      .returning();

    // Generate tokens
    const tokens = await this.generateTokens(newUser.id, newUser.email);

    // Update refresh token in database
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Update refresh token in database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Find user
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // Verify refresh token
    const isRefreshTokenValid = await this.verifyPassword(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Update refresh token in database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    // Clear refresh token from database
    await this.databaseService.db
      .update(users)
      .set({ refreshToken: null, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return { message: 'Logged out successfully' };
  }

  async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.databaseService.db
      .update(users)
      .set({ refreshToken: hashedRefreshToken, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async hashData(data: string): Promise<string> {
    return hash(data, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }

  async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    try {
      return await verify(hashedPassword, plainPassword);
    } catch (error) {
      return false;
    }
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;

    // Find user by email
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Generate a random reset token (32 bytes = 64 hex characters)
    const resetToken = randomBytes(32).toString('hex');

    // Hash the token before storing
    const hashedResetToken = await this.hashData(resetToken);

    // Set expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Store hashed token and expiry in database
    await this.databaseService.db
      .update(users)
      .set({
        resetToken: hashedResetToken,
        resetTokenExpiry,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Return the plain token to the user (this would normally be sent via email)
    return {
      message: 'Password reset token generated',
      resetToken,
      expiresAt: resetTokenExpiry,
      email: user.email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;

    // Find user with a non-expired reset token
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.resetToken, resetToken))
      .limit(1);

    // Check if user exists and has a reset token
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Verify the token matches
    const isTokenValid = await this.verifyPassword(user.resetToken, resetToken);

    if (!isTokenValid) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await this.hashData(newPassword);

    // Update password and clear reset token
    await this.databaseService.db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        refreshToken: null, // Clear refresh token for security
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    return {
      message: 'Password reset successfully',
    };
  }
}
