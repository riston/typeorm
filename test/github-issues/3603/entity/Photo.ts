import {User} from "./User";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from '../../../../src';

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    user_id: number;

    @ManyToOne(() => User, user => user.photos)
    @JoinColumn({ name: 'user_id' })
    user: User;

}