import { User } from 'src/users/entities/user.entity';
import {
    BadRequestException,
    CACHE_MANAGER,
    Inject,
    Injectable,
} from '@nestjs/common';
import { SendVerifyCodeDto, SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { createHash, randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from './entities/access-token.entity';
import Kavenegar from 'kavenegar';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(AccessToken)
        private tokenRepository: Repository<AccessToken>,
    ) {}

    sendSms(phone: string, code: string) {
        return new Promise((resolve, reject) => {
            const api = Kavenegar.KavenegarApi({
                apikey: process.env.KAVENEGAR_API_KEY,
            });
            api.VerifyLookup(
                {
                    receptor: phone,
                    token: code,
                    template: process.env.KAVENEGAR_TEMPLATE,
                },
                function (response, status) {
                    if (status !== 200) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                },
            );
        });
    }

    async sendVerifyCode(sendVerifyCodeDto: SendVerifyCodeDto) {
        const code = new Array(6)
            .fill(0)
            .map(() => randomInt(1, 10))
            .join('');
        process.env.NODE_ENV === 'DEVELOPMENT' && console.log(code);
        process.env.NODE_ENV === 'PRODUCTION' &&
            (await this.sendSms(sendVerifyCodeDto.phone, code));

        await this.cacheManager.set(
            `${sendVerifyCodeDto.phone}-verifyCode`,
            code,
            120,
        );
    }

    createAccessToken() {
        const token = randomBytes(64).toString('hex');
        const hashToken = createHash('sha256').update(token).digest('hex');
        return [token, hashToken];
    }

    async signup(signUpDto: SignUpDto) {
        const key = `${signUpDto.phone}-verifyCode`;
        const code = await this.cacheManager.get(key);
        if (code !== signUpDto.code) {
            throw new BadRequestException('the given data was invalid');
        }
        const [token, hashToken] = this.createAccessToken();
        const accessToken = this.tokenRepository.create({
            token: hashToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now,
        });
        const user = this.userRepository.create({
            phone: signUpDto.phone,
            password: bcrypt.hashSync(
                signUpDto.password,
                bcrypt.genSaltSync(8),
            ),
            accessTokens: [accessToken],
        });
        const newUser = await this.userRepository.save(user);
        return `${newUser.accessTokens[0].id}|${token}`;
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            select: { id: true, password: true },
            where: {
                phone: loginDto.phone,
            },
        });
        if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
            throw new BadRequestException('the given data is invalid');
        }
        const countOfAvailableTokens = await this.tokenRepository
            .createQueryBuilder('token')
            .where(
                'token.user.id = :userId AND token.deletedAt IS  NULL AND token.expiresAt > NOW()',
                { userId: user.id },
            )
            .getCount();
        if (countOfAvailableTokens > 3) {
            await this.tokenRepository.update(
                { user: user },
                { deletedAt: new Date() },
            );
        }
        const [token, hashToken] = this.createAccessToken();
        const newAccessToken = await this.tokenRepository.save({
            token: hashToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now,
            user,
        });
        return `${newAccessToken.id}|${token}`;
    }
}
