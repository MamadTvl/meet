import { AuthGuard } from './../common/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('user')
@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('edit')
    async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
        await this.usersService.update(req.user.id, updateUserDto);
        return {
            message: 'Your information successfully updated',
        };
    }
}
