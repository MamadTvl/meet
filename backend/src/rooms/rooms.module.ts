import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { Member } from './entities/room-member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room, Member])],
    controllers: [RoomsController],
    providers: [RoomsService],
})
export class RoomsModule {}
