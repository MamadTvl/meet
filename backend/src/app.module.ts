import { PeerServerModule } from './modules/peer-server/peer-server.module';
import {
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AuthorizationMiddleware } from './common/middleware/authorization.middleware';
import { MeetModule } from './meet/meet.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule.register({ isGlobal: true }),
        // PeerServerModule.register({
        //     path: '/',
        //     allow_discovery: true,
        //     // proxied: 'true',
        // }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            port: +process.env.MYSQL_PORT,
            socketPath: process.env.MYSQL_SOCKET_PATH ?? undefined,
            synchronize: process.env.NODE_ENV === 'DEVELOPMENT',
            autoLoadEntities: true,
            logging: process.env.NODE_ENV === 'DEVELOPMENT',
            migrations: ['migrations/*{.ts,.js}'],
            migrationsTableName: 'migrations_typeorm',
            migrationsRun: process.env.NODE_ENV === 'PRODUCTION',
        }),
        UsersModule,
        RoomsModule,
        MessagesModule,
        RolesModule,
        AuthModule,
        MeetModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizationMiddleware).forRoutes('*');
    }
}
