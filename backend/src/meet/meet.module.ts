import { User } from './../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from './../common/middleware/authorization.middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetGateway } from './meet.gateway';

@Module({
    providers: [MeetGateway, MeetService],
    imports: [TypeOrmModule.forFeature([User])],
})
export class MeetModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizationMiddleware).forRoutes('*');
    }
}
