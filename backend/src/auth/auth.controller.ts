import { LoginDto } from './dto/login.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendVerifyCodeDto, SignUpDto } from './dto/signup.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(200)
    @Post('send-verify-code')
    async sendVerifyCode(@Body() signUpDto: SendVerifyCodeDto) {
        await this.authService.sendVerifyCode(signUpDto);
        return {
            message: 'verification code successfully sent',
        };
    }

    @HttpCode(200)
    @Post('signup')
    async signup(@Body() signUpDto: SignUpDto) {
        const token = await this.authService.signup(signUpDto);
        return {
            token,
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.authService.login(loginDto);
        return { token };
    }
}
