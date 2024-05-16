import type { Response, Request } from 'express'
import type { HttpError } from 'http-errors'
import { Router } from 'express'
import { Auth } from 'lib/auth'
import { UserService } from 'services/user.service'
import { validateSchema } from 'lib/validateSchema'
import { signUpSchema, signInSchema } from 'lib/schemas'
import { BAD_REQUEST, CONFLICT, CREATED, OK } from 'http-status'

const AuthController = () => {
  const auth = Auth()

  const router = Router()

  const createUser = async (req: Request, res: Response) => {
    const { data } = req.body
    const { firstName, lastName, email, password } = data

    try {
      const userExists = await UserService().getByEmail(email)
      if (userExists) {
        res.status(CONFLICT).json({
          status: 409,
          message: 'User already exists',
          data: null,
        })
        return
      }

      await UserService().create(firstName, lastName, email, password)

      res.status(CREATED).json({
        status: CREATED,
        message: 'User created successfully',
        data: null,
      })
    } catch (error) {
      const httpError = error as HttpError
      res.status(httpError.statusCode).json({
        status: httpError.statusCode,
        message: httpError.message,
        data: null,
      })
    }
  }

  const createSession = async (req: Request, res: Response) => {
    const { data } = req.body
    const { email, password } = data

    try {
      const user = await UserService().getByEmail(email)
      const passwordMatches = await auth.comparePasswords(
        password,
        user?.password ?? ''
      )

      if (!user || !passwordMatches) {
        res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          message: 'Incorrect email or password',
          data: null,
        })

        return
      }
      // TODO: Delete user password
      const token = auth.generateJWT(user.id)

      res.cookie('jwt', token, { httpOnly: true }).json({
        status: OK,
        message: 'User authenticated successfully',
        data: user,
      })
    } catch (error) {
      const httpError = error as HttpError
      res.status(httpError.statusCode).json({
        status: httpError.statusCode,
        message: httpError.message,
        data: null,
      })
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
