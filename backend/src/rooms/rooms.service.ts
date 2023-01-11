import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role, Roles, RoleType } from 'src/roles/entities/role.entity';
import { Permissions } from 'src/roles/entities/permission.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
    ) {}
    // FIXME: maybe we should just create guard for permissions but there is no time
    private getAccessQuery(
        userId: number,
        roomId: string,
        permissions: Permissions[],
    ) {
        const query = this.roomRepository.createQueryBuilder('room');
        query.where('room.id = :roomId', { roomId });
        query.innerJoin('room.members', 'member', 'member.user.id = :userId', {
            userId,
        });

        query.innerJoin('member.role', 'role');
        query.innerJoin(
            'role.permissions',
            'permission',
            permissions
                .map((_, index) => `permission.name = :permission${index}`)
                .join(' OR '),
            JSON.parse(
                `{${permissions
                    .map(
                        (permission, index) =>
                            `"permission${index}":"${permission}"`,
                    )
                    .join(',')}}`,
            ),
        );
        return query;
    }

    private getFindQuery(userId: number) {
        const query = this.roomRepository.createQueryBuilder('room');
        query.innerJoin('room.members', 'member', 'member.user.id = :userId', {
            userId,
        });
        query.innerJoin(
            'member.role',
            'role',
            'role.name = :roleName AND role.type = :roleType',
            { roleName: Roles.ADMIN, roleType: RoleType.ROOM },
        );
        return query;
    }

    async create(user: User, createRoomDto: CreateRoomDto) {
        const role = await this.roleRepository.findOneBy({
            type: RoleType.ROOM,
            name: Roles.ADMIN,
        });
        const newRoom = await this.roomRepository.save({
            name: createRoomDto.name,
            members: [{ user, role }],
        });
        return newRoom;
    }

    async findAll(userId: number) {
        const query = this.getFindQuery(userId);
        return await query.getMany();
    }

    async findOne(userId: number, roomId: string) {
        const query = this.getFindQuery(userId);
        query.where('room.id = :roomId', { roomId });
        query.innerJoinAndSelect('room.members', 'members');
        return await query.getOne();
    }

    async update(userId: number, roomId: string, updateRoomDto: UpdateRoomDto) {
        try {
            const query = this.getAccessQuery(userId, roomId, [
                Permissions.MODIFY_ROOM,
            ]);
            await query.getOne();
            await this.roomRepository.update({ id: roomId }, updateRoomDto);
        } catch (err) {}
    }

    async remove(userId: number, roomId: string) {
        try {
            const query = this.getAccessQuery(userId, roomId, [
                Permissions.ALL_ROOM,
                Permissions.DELETE_ROOM,
            ]);
            await query.getOneOrFail();
            await this.roomRepository
                .createQueryBuilder('room')
                .delete()
                .where('id = :roomId', { roomId })
                .execute();
        } catch (err) {
            throw new BadRequestException();
        }
    }
}
