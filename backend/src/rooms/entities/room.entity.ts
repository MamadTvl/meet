import { Member } from 'src/rooms/entities/room-member.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Message } from 'src/messages/entities/message.entity';

@Entity({ name: 'rooms' })
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @OneToMany(() => Message, (message) => message.room, { cascade: true })
    messages: Message[];

    @OneToMany(() => Member, (member) => member.room, { cascade: true })
    members: Member[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
