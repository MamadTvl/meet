import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    getQuery(tokenId: number, token: string) {
        const query = this.userRepository.createQueryBuilder('user');
        query.innerJoin('user.accessTokens', 'tokens');
        query.leftJoinAndSelect('user.roles', 'roles');
        query.where(
            'tokens.id = :tokenId AND tokens.token = :token AND tokens.deletedAt IS NULL AND tokens.expiresAt > NOW()',
            {
                tokenId,
                token: createHash('sha256').update(token).digest('hex'),
            },
        );
        return query;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const bearerToken = req.headers.authorization || '';
        const [id, token] = bearerToken.replace('Bearer ', '').split('|');
        if (id && token) {
            const user = await this.getQuery(+id, token).getOne();
            req.user = user;
        }

        next();
    }
}
