import { Request, Response } from "express";
import { UserRepo } from "../../db/repository/userRepository";
import { CodesFiveRepo } from '../../db/repository/codeRepository'

import nodemailer from 'nodemailer'
import dayjs from "dayjs";
import bcrypt from 'bcrypt'

import {sign} from 'jsonwebtoken'

export class UserController {

    #userRepo = new UserRepo()
    #codeRepo = new CodesFiveRepo()

    signup = async (req: Request, res: Response) => {

        const { login: email, name, password, telefone } = req.body

        const result = await this.#userRepo.create(name, email, password, telefone)
        if (!result) return res.json({'error': "email ja cadastrado"})

        
        const {token, refresh_token} = await this.#jwtGenerator(result)
        await this.#userRepo.saveRefreshToken(refresh_token, result)


        const fivedigit = Math.floor(Math.random() * 90000) + 10000;
        await this.#codeRepo.saveCode(fivedigit, result)

        await this.#sendCode(fivedigit)

        return res.json({token, refresh_token})

    }

    signin = async (req: Request, res: Response) => {
        const {login, password} = req.body

        const user = await this.#userRepo.getUser(login)

        console.log(user)

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password)

            if (validPassword) {
                const {token, refresh_token} = await this.#jwtGenerator(user)
                await this.#userRepo.updateRefreshToken(refresh_token, user)

                return res.json({token, refresh_token})
            }
        }


    }

    emailValidation = async (req: Request, res: Response) => {
        
        const {code, login} = req.body

        const user = await this.#userRepo.getUser(login)
        const getcode = await (await this.#codeRepo.getCodeByUser(user.id))


        if (getcode.code === code && dayjs().unix() < getcode.ExpiresIn){
            await this.#userRepo.activeUser(user)

            return res.json({"message": "codigo verificado com sucesso"})
        }

        return res.json({'error': "ocorreu um erro"})


    }

    #sendCode = async (fivedigit) => {
        console.log(`Este ?? seu numero de valida????o: ${fivedigit}`)
    }


    #jwtGenerator = async (user) => {
        const token = sign({telefone: user.telefone}, process.env.SECRET as string, {subject: user.id, expiresIn: '2h'})
        const refresh_token = sign({}, process.env.REFRESH_SECRET as string, {subject: user.id, expiresIn: '30d'})

        return {
            token,
            refresh_token
        }
    }

}