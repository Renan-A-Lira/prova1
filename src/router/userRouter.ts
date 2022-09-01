import { Router } from "express"
import  { UserController } from '../controller/userController'

const user = new UserController()

const router = Router()

router.post('/signup', user.signup)
router.post('/signin', user.signin)
router.post('/emailValidation', user.emailValidation)


export default router