import { User } from 'src/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './entities/access-token.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 60 * 60 * 24, //1 day
            limit: 24,
            skipIf(context) {
                return (
                    context.getArgs()[0].url !== '/api/auth/send-verify-code'
                );
            },
        }),
        TypeOrmModule.forFeature([AccessToken, User]),
    ],
    exports: [TypeOrmModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AuthModule {}
