import { type NextFunction, type Request, type Response, Router } from 'express'
import createHttpError from 'http-errors'
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status'
import { validateBody } from 'middlewares/validate'
import { signInSchema, signUpSchema } from 'lib/schemas'
import { UserService } from './user.service'
import { AuthPassport, AuthUtils } from 'lib/auth'

class UserController {
  private router: Router
  private authUtils: AuthUtils
  private userService: UserService
  private authPassport: AuthPassport

  constructor(
    userService: UserService,
    authPassport: AuthPassport,
    authUtils: AuthUtils
  ) {
    this.router = Router()
    this.authPassport = authPassport
    this.authUtils = authUtils
    this.userService = userService
    this.initializeRoutes()
  }

  private getById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id)

    try {
      const user = await this.userService.getById(userId)
      if (!user) {
        return next(createHttpError(NOT_FOUND, 'User not found'))
      }
      res.json({ data: user })
    } catch (error) {
      next(error)
    }
  }

  private getByAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req?.user as any)?.id

    if (!userId) throw new Error('User Id not found')

    try {
      const user = await this.userService.getById(userId)
      if (!user) {
        return next(createHttpError(NOT_FOUND, 'User not found'))
      }
      res.json({ data: user })
    } catch (error) {
      next(error)
    }
  }

  private getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll()
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  private updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = parseInt(req.params.id)
    const { first_name, last_name, email, password } = req.body

    try {
      const updatedUser = await this.userService.updateById(
        userId,
        first_name,
        last_name,
        email,
        password
      )
      if (!updatedUser) {
        return next(createHttpError(NOT_FOUND, 'User not found'))
      }
      res.status(OK).json({
        success: true,
        statusCode: OK,
        message: 'User updated successfully',
        payload: null,
      })
    } catch (error) {
      next(error)
    }
  }

  private deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = parseInt(req.params.id)

    try {
      const deletedUser = await this.userService.deleteById(userId)
      if (!deletedUser) {
        return next(createHttpError(NOT_FOUND, 'User not found'))
      }

      res.json({
        success: true,
        statusCode: OK,
        message: 'User deleted successfully',
        payload: null,
      })
    } catch (error) {
      next(error)
    }
  }

  private authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body

    try {
      const user = await this.userService.getByEmail(email)
      const passwordMatches = await this.authUtils.comparePasswords(
        password,
        user?.password ?? ''
      )

      if (!user || !passwordMatches) {
        return next(createHttpError(BAD_REQUEST, 'Incorrect email or password'))
      }

      const token = this.authUtils.generateJWT(user.id)
      res.cookie('jwt', token, { httpOnly: true })

      res.json({
        status: OK,
        message: 'User authenticated successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
  private create = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body
    try {
      const userExists = await this.userService.getByEmail(email)
      if (userExists) {
        return next(createHttpError(CONFLICT, 'User already exists'))
      }

      await this.userService.create(firstName, lastName, email, password)

      res.status(CREATED).json({
        success: true,
        statusCode: CREATED,
        message: 'User created successfully',
        payload: null,
      })
    } catch (error) {
      next(error)
    }
  }

  private initializeRoutes() {
    // TODO: Implement authorization middleware
    this.router.get('/me', this.authPassport.authenticate, this.getByAuth)
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
