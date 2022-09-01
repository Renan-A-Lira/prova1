import { Request, Response } from "express";
import { UserRepo } from "../../db/repository/userRepository";
import { CodesFiveRepo } from '../../db/repository/codeRepository'

import nodemailer from 'nodemailer'
import dayjs from "dayjs";

import {sign} from 'jsonwebtoken'

export class UserController {

    #userRepo = new UserRepo()
    #codeRepo = new CodesFiveRepo()

    signup = async (req: Request, res: Response) => {

        const { login: email, name, password, telefone } = req.body

        const result = await this.#userRepo.create(name, email, password, telefone)
        if (!result) return res.json({'error': "email ja cadastrado"})

        
        const {token, refresh_token} = await this.#jwtGenerator(result)
        
        const fivedigit = Math.floor(Math.random() * 90000) + 10000;
        await this.#codeRepo.saveCode(fivedigit, result)

        await this.#sendCode(fivedigit)

        return res.json({token, refresh_token})

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
        console.log(`Este é seu numero de validação: ${fivedigit}`)
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