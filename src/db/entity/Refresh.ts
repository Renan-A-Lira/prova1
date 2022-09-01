import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";



@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    token: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @Column()
    ExpiresIn: number


}

