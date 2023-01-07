import { Role } from './../../roles/entities/role.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccessToken } from 'src/auth/entities/access-token.entity';
import { Member } from 'src/rooms/entities/room-member.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', nullable: true })
    firstName: string | null;

    @Column({ name: 'last_name', nullable: true })
    lastName: string | null;

    @Column({ nullable: true })
    email: string | null;

    @Column({ nullable: true })
    phone: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToMany(() => Role, (role) => role.adminUsers)
    @JoinTable({
        name: 'users_has_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];

    @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
    accessToken: AccessToken[];

    @OneToMany(() => Member, (member) => member.user)
    members: Member[];
}
