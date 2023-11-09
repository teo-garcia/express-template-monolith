import { Router } from 'express'
import type { Response, Request } from 'express'
import { UserService } from '../services/user.services'
import { generateJWT } from '../lib/auth/jwt'
import { comparePasswords } from '../lib/auth/bcrypt'
import { logger } from '../lib/misc/logger'
import { validateSchema } from '../lib/misc/validateSchema'
import { signUpSchema, signInSchema } from '../lib/misc/schemas'
class AuthController {
  private userService: UserService
  private router: Router

  constructor() {
    this.userService = new UserService()
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post('/signup', validateSchema(signUpSchema), this.signup)
    this.router.post('/signin', validateSchema(signInSchema), this.signin)
  }

  public signup = async (req: Request, res: Response) => {
    const { data } = req.body
    const { first_name, last_name, email, password } = data
    try {
      const userExists = await this.userService.getUserByEmail(email)
      if (userExists) {
        res.status(409).json({
          status: 409,
          message: 'User already exists',
          data: null,
        })
        return
      }

      await this.userService.createUser(first_name, last_name, email, password)

      res
        .status(201)
        .json({ status: 201, message: 'User created successfully', data: null })
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ status: 500, message: 'Internal Server Error', data: null })
    }
  }

  public signin = async (req: Request, res: Response) => {
    const { data } = req.body
    const { email, password } = data
    try {
      const user = await this.userService.getUserByEmail(email)
      const passwordMatches =
        user && (await comparePasswords(password, user.password))

      if (!passwordMatches) {
        res.status(409).json({
          status: 409,
          message: 'Incorrect email or password',
          data: null,
        })

        return
      }

      const token = generateJWT(user)
      delete user.password

      res.cookie('jwt', token, { httpOnly: true }).json({
        status: 200,
        message: 'User authenticated successfully',
        data: user,
      })
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  public getRouter() {
    return this.router
  }
}

export { AuthController }
