import { User } from './../entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';
import { ApiBody, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(User) {
    @ApiPropertyOptional()
    @IsString()
    @MinLength(2)
    firstName?: string;
    @ApiPropertyOptional()
    @IsString()
    @MinLength(2)
    lastName?: string;
}
