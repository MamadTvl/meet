import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
        }),
        UsersModule,
        RoomsModule,
        MessagesModule,
        RolesModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
