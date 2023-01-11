import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum Permissions {
    ALL = 'ALL',
    ALL_ROOM = 'ROOM_*',
    DELETE_ROOM = 'DELETE_ROOM',
    MODIFY_ROOM = 'MODIFY_ROOM',
}
@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    @JoinTable({
        name: 'role_has_permissions',
        joinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}
