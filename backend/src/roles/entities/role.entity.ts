import { User } from './../../users/entities/user.entity';
import { Member } from './../../rooms/entities/room-member.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

export enum RoleType {
    ADMIN = 'ADMIN',
    ROOM = 'ROOM',
}

export enum Roles {
    ADMIN = 'ADMIN',
}
@Unique(['name', 'type'])
@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ enum: RoleType, type: 'enum', select: false })
    type: RoleType;

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({
        name: 'role_has_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    permissions: Permission[];

    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable({
        name: 'users_has_roles',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    adminUsers: User[];

    @OneToMany(() => Member, (member) => member.role)
    members: Member[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
