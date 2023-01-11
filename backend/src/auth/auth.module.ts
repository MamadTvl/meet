import { User } from 'src/users/entities/user.entity';
import { Module, CacheModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './entities/access-token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AccessToken, User])],
    exports: [TypeOrmModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
