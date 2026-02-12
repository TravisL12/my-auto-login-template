import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'postgresql://authuser:authpassword@localhost:5432/authdb',
}));
