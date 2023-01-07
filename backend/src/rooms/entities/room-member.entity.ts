import { Room } from './room.entity';
import { Role } from './../../roles/entities/role.entity';
import { User } from './../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum MemberStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

@Entity('room_members')
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: MemberStatus, type: 'enum' })
    status: MemberStatus;

    @ManyToOne(() => User, (user) => user.members)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, (role) => role.members)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Room, (room) => room.members)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
