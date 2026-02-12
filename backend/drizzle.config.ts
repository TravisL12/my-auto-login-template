import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/*.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://authuser:authpassword@localhost:5432/authdb',
  },
  verbose: true,
  strict: true,
});
