import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    name: string;
}
