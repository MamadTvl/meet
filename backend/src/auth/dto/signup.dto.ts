import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsPhoneNumber,
    IsString,
    MinLength,
    ValidateIf,
} from 'class-validator';

export class SendVerifyCodeDto {
    @ApiPropertyOptional()
    @ValidateIf((obj) => !obj.email)
    @IsPhoneNumber('IR')
    phone: string;

    @ApiPropertyOptional()
    @ValidateIf((obj) => !obj.phone)
    @IsEmail()
    email: string;
}

export class SignUpDto {
    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsPhoneNumber('IR')
    phone: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;
}
