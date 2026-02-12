import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/user.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: PostgresJsDatabase<typeof schema>;
  private client: postgres.Sql;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    // Create the connection
    this.client = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Initialize Drizzle
    this.db = drizzle(this.client, { schema });

    console.log('Database connection established successfully');
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
