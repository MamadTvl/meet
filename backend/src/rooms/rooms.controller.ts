// TODO: Invite others to the Room
// 1. Create inviteLink entity -> linkUri = token, roomId
// 2. For now Users can share there roomId to others just like google meet

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
@ApiTags('room')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('room')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    async create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
        const room = await this.roomsService.create(req.user, createRoomDto);
        return {
            message: 'room created',
            room,
        };
    }

    @Get()
    async findAll(@Req() req: Request) {
        return {
            message: 'rooms found',
            rooms: await this.roomsService.findAll(req.user.id),
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request) {
        return {
            message: 'room found',
            room: await this.roomsService.findOne(req.user.id, id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRoomDto: UpdateRoomDto,
        @Req() req: Request,
    ) {
        await this.roomsService.update(req.user.id, id, updateRoomDto);
        return {
            message: 'room updated',
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request) {
        await this.roomsService.remove(req.user.id, id);
        return {
            message: 'room deleted',
        };
    }
}
