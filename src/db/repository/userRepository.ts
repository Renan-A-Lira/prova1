import { AppDataSource } from "..";
import { User } from "../entity/User";

import bcrypt from 'bcrypt'



export class UserRepo {

    #userRepository = AppDataSource.getRepository(User)

    create = async (name, email, password, telefone) => {

        if (await this.#verifyUserExisty(email)) return null
        
        const newUser = new User()

        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(password, salt)

        newUser.name = name
        newUser.telefone = telefone
        newUser.login = email

        const user = await this.#userRepository.save(newUser)

        return user

    }

    getUser = async (email) => {
        const user = this.#verifyUserExisty(email)
        
        return user
    }

    activeUser = async (user) => {

        await this.#userRepository.update({id: user.id}, {active: true})
    }


    #verifyUserExisty = async (email) => {

        const user = await this.#userRepository.findOne({
            where: {login: email}
        })


        return user || null
    }

}