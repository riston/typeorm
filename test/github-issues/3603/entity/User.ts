import {Photo} from "./Photo";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from '../../../../src';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Photo, photo => photo.user)
    photos: Photo[];

}