import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";



@Entity()
export class CodesFive {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    code: number

    @OneToOne(() => User)
    @JoinColumn()
    userId: User

    @Column()
    ExpiresIn: number


}