import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

// Usuário (id, name, login, telefone, password, conta ativa)


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    login: string

    @Column({unique: true})
    telefone: string

    @Column()
    password: string

    @Column({type: 'bool', default: false})
    active: boolean

    


}