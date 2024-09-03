import { Request, Response, Router } from 'express'
import { UserService } from '../user/user.service'
import { logger } from '../lib/logger'
import { HttpError } from 'http-errors'
import { BAD_REQUEST, CONFLICT, CREATED, OK } from 'http-status'
import { Auth } from '../lib/auth'
import { validateBody } from '../middlewares/validate'
import { signInSchema, signUpSchema } from '../lib/schemas'

class UserController {
  private router: Router
  private auth = Auth()

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const user = await UserService().getByEmail(email)
      const passwordMatches = await this.auth.comparePasswords(
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
      const token = this.auth.generateJWT(user.id)

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

  private getAll = async (req: Request, res: Response) => {
    try {
      const users = await UserService().getAll()
      res.json(users)
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ error: 'Internal Server Error', data: null, status: 500 })
    }
  }

  private getById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)

    try {
      const user = await UserService().getById(userId)
      if (user) {
        res.json({
          data: user,
        })
      } else {
        res
          .status(404)
          .json({ message: 'User not found', data: null, status: 404 })
      }
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ message: 'Internal Server Error', data: null, status: 500 })
    }
  }

  private create = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body
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

  private updateById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const { first_name, last_name, email, password } = req.body

    try {
      const updatedUser = await UserService().updateById(
        userId,
        first_name,
        last_name,
        email,
        password
      )
      if (updatedUser) {
        res.json(updatedUser)
      } else {
        res
          .status(404)
          .json({ message: 'User not found', status: 404, data: null })
      }
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ message: 'Internal Server Error', status: 500, data: null })
    }
  }

  private deleteById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)

    try {
      const deletedUser = await UserService().deleteById(userId)
      if (deletedUser) {
        res.json({ message: 'User deleted successfully' })
      } else {
        res
          .status(404)
          .json({ message: 'User not found', data: null, status: 404 })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', data: null, status: 500 })
    }
  }

  private initializeRoutes() {
    // TODO: Implement authorization middleware
    this.router.get('/', this.getAll)
    this.router.get('/:id', this.getById)
    this.router.post('/', this.create)
    this.router.put('/:id', this.updateById)
    this.router.delete('/:id', this.deleteById)

    this.router.post('/signup', validateBody(signUpSchema), this.create)
    this.router.post('/signin', validateBody(signInSchema), this.authenticate)
  }

  public getRouter() {
    return this.router
  }
}

export { UserController }
