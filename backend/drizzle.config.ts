import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema/*.schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://authuser:authpassword@postgres:5432/authdb',
  },
  verbose: true,
  strict: true,
} satisfies Config;
