import dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: +process.env.MYSQL_PORT,
    socketPath: process.env.MYSQL_SOCKET_PATH ?? undefined,
    synchronize: process.env.NODE_ENV === 'DEVELOPMENT',
    logging: process.env.NODE_ENV === 'DEVELOPMENT',
    migrations: ['../migrations/*{.ts,.js}'],
    entities: ['../**/**/entities/*.entity.{js,ts}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
});
export default dataSource;
