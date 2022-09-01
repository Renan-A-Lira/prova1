import { AppDataSource } from "..";
import { CodesFive } from "../entity/Codes";

import dayjs from "dayjs";



export class CodesFiveRepo {

    #repo = AppDataSource.getRepository(CodesFive)

    saveCode = async (code, user) => {

        const newcode = new CodesFive()
        const expiresIn = dayjs().add(2, 'hour').unix()


        newcode.code = code
        newcode.ExpiresIn = expiresIn
        newcode.userId = user

        await this.#repo.save(newcode)




    }

    getCodeByUser = async (userId) => {
        const c = this.#repo.findOne({
            where: {userId: {id:userId}}
        })

        return c
    }

}