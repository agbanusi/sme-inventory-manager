import { DataSource, DataSourceOptions } from 'typeorm';
import config from '@/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
require('dotenv').config();

const connection: {
  host?: string;
  username?: string;
  password?: string;
  database?: string;
  port?: number;
  url?: string;
} = {};

if (process.env.NODE_ENV === 'dev') {
  connection.host = process.env.DB_HOST;
  connection.username = process.env.DB_USER;
  connection.password = process.env.DB_PASSWORD;
  connection.database = process.env.DB_NAME;
  connection.port = Number(process.env.DB_PORT);
} else {
  connection.url = config.db.url;
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: config.db.url,
  migrations: ['dist/db/migrations/*.js'],
  entities: [],
  logging: false,
  ssl: false,
  synchronize: false,
};

export const dataSource = new DataSource(typeOrmConfig);
