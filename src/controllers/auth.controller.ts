import type { Response, Request } from 'express'
import { Router } from 'express'
import { UserService } from '../services/user.service'
import { logger } from '../lib/misc/logger'
import { validateSchema } from '../lib/misc/validateSchema'
import { signUpSchema, signInSchema } from '../lib/misc/schemas'
import { comparePasswords, generateJWT } from '../lib/auth'

const AuthController = () => {
  const router = Router()

  const createUser = async (req: Request, res: Response) => {
    const { data } = req.body
    const { firstName, lastName, email, password } = data

    try {
      const userExists = await UserService().getByEmail(email)
      if (userExists) {
        res.status(409).json({
          status: 409,
          message: 'User already exists',
          data: null,
        })
        return
      }

      await UserService().create(firstName, lastName, email, password)

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

  const createSession = async (req: Request, res: Response) => {
    const { data } = req.body
    const { email, password } = data

    try {
      const user = await UserService().getByEmail(email)
      const passwordMatches = await comparePasswords(
        password,
        user?.password ?? ''
      )

      if (!user || !passwordMatches) {
        res.status(409).json({
          status: 409,
          message: 'Incorrect email or password',
          data: null,
        })

        return
      }
      // TODO: Delete user password
      const token = generateJWT(user.id)

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

  const initializeRoutes = () => {
    router.post('/signup', validateSchema(signUpSchema), createUser)
    router.post('/signin', validateSchema(signInSchema), createSession)
  }

  initializeRoutes()

  return router
}

export { AuthController }
