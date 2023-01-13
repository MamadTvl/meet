import { Module } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetGateway } from './meet.gateway';

@Module({
    providers: [MeetGateway, MeetService],
})
export class MeetModule {}
