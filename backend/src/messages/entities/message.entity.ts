import { Room } from 'src/rooms/entities/room.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageType {
    MEDIA = 'MEDIA',
    TEXT = 'TEXT',
}

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'tinytext', nullable: true })
    text: string;

    @Column({ enum: MessageType, type: 'enum' })
    type: MessageType;

    @ManyToOne(() => Room, (room) => room.messages)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    // @OneToOne(() => Media, (media) => media.message)
    // media: Media;
}
