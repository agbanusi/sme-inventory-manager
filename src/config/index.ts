import * as path from 'node:path';
import 'dotenv/config';

export default {
  port: Number.parseInt(process.env.PORT, 10),
  env: process.env.ENV,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
  redis: {
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    port: Number(process.env.REDIS_PORT),
  },
  db: { url: process.env.DATABASE_URL },
  jwtSecret: process.env.JWT_SECRET,
};
