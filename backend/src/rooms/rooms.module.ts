import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { Member } from './entities/room-member.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room, Member, Role])],
    exports: [TypeOrmModule],
    controllers: [RoomsController],
    providers: [RoomsService],
})
export class RoomsModule {}
