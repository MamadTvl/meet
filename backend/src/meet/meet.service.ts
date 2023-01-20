import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { MeetSocket } from './types';

@Injectable()
export class MeetService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    private getUserQuery(tokenId: number, token: string, roomId: string) {
        const query = this.userRepository.createQueryBuilder('user');
        query.innerJoin('user.accessTokens', 'tokens');
        query.where(
            'tokens.id = :tokenId AND tokens.token = :token AND tokens.deletedAt IS NULL AND tokens.expiresAt > NOW()',
            {
                tokenId,
                token: createHash('sha256').update(token).digest('hex'),
            },
        );
        query.leftJoinAndSelect('user.memberships', 'membership');
        query.innerJoinAndSelect(
            'membership.room',
            'room',
            'room.id = :roomId',
            { roomId },
        );
        query.leftJoinAndSelect('membership.role', 'role');
        query.leftJoinAndSelect('role.permissions', 'permission');
        return query;
    }

    private getUserHasRoomQuery(userId: number, roomId: string) {
        const query = this.userRepository.createQueryBuilder('user');
        query.where('user.id = :userId', { userId });
        query.innerJoin('user.memberships', 'membership');
        query.innerJoin(
            'membership.room',
            'room',
            'room.id = :roomId AND room.isActive = :isActive',
            {
                roomId,
                isActive: true,
            },
        );
        return query;
    }

    public async userHasRoom(userId: number | undefined, roomId: string) {
        if (!userId) {
            return false;
        }
        const query = this.getUserHasRoomQuery(userId, roomId);
        try {
            await query.getOneOrFail();
            return true;
        } catch {
            return false;
        }
    }

    public async userData(
        bearerToken: string,
        roomId: string,
    ): Promise<User | null> {
        const [id, token] = bearerToken.replace('Bearer ', '').split('|');
        if (id && token) {
            const user = await this.getUserQuery(+id, token, roomId).getOne();
            return user;
        }
        return null;
    }

    public async joinUserToRoom(client: MeetSocket, roomId: string) {
        if (client.data?.memberships[0]?.room.id === roomId) {
            client.join(roomId);
            return;
        }
        client.emit('connection-status', {
            status: 'ask-to-join',
        });
    }

    public async updateUserStatus() {
        throw new Error('method not implemented yet');
    }
}
