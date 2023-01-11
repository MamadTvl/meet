import { LoginDto } from './dto/login.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendVerifyCodeDto, SignUpDto } from './dto/signup.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
@ApiBearerAuth()
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

    @UseGuards(AuthGuard)
    @Get('me')
    findMe(@Req() req: Request) {
        return {
            message: 'user found',
            user: req.user,
        };
    }
}
