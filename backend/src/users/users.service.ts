import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async findByUsername(username: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.databaseService.db
      .update(users)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
