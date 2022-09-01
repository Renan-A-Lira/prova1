import { AppDataSource } from "..";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/Refresh";

import bcrypt from 'bcrypt'
import dayjs from "dayjs";



export class UserRepo {

    #userRepository = AppDataSource.getRepository(User)
    #refreshRepository = AppDataSource.getRepository(RefreshToken)

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


    saveRefreshToken = async (rtoken, user) => {


        const token = new RefreshToken

        token.token = rtoken
        token.ExpiresIn = dayjs().add(30, 'day').unix()
        token.user = user

        return await this.#refreshRepository.save(token)
    }

    updateRefreshToken = async (rtoken, userId) => {
        await this.#refreshRepository.update({user: {id: userId.id}}, {token: rtoken, ExpiresIn: dayjs().add(30, 'day').unix()})
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