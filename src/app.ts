import express, { ErrorRequestHandler, RequestHandler } from 'express'
import cors from 'cors'
import passport from 'passport'
import { UserController } from './modules/user/user.controller'
import { HealthcheckController } from './modules/healthcheck/healthcheck.controller'
import type { PrismaClient } from '@prisma/client'
import type { Logger } from 'winston'
import { UserService } from 'modules/user/user.service'
import { AuthPassport, AuthUtils } from 'lib/auth'

class App {
  private db: PrismaClient
  private logger: Logger
  private middlewares: Record<string, RequestHandler | ErrorRequestHandler>
  private host: string
  private port: number
  private baseUrl: string
  private app: express.Application
  private userService: UserService
  private authUtils: AuthUtils
  private authPassport: AuthPassport

  constructor(
    db: PrismaClient,
    logger: Logger,
    middlewares: Record<string, RequestHandler | ErrorRequestHandler>
  ) {
    this.db = db
    this.logger = logger
    this.middlewares = middlewares
    this.host = process.env?.SERVER_HOST || '0.0.0.0'
    this.port = parseInt(process.env?.PORT as string) || 3000
    this.baseUrl = `http://${this.host}:${this.port}`
    this.app = express()
    this.authUtils = new AuthUtils(10, process.env.JWT_SECRET!)
    this.userService = new UserService(this.authUtils)
    this.authPassport = new AuthPassport(
      process.env.JWT_SECRET!,
      this.userService
    )
  }

  private connectDatabase = async () => {
    try {
      await this.db.$connect()
      this.logger.info('Database connection successful')
    } catch (error) {
      this.logger.error('Database connection error')
      if (error instanceof Error) this.logger.error(error.message)
      throw error
    }
  }

  private registerMiddlewares = () => {
    this.app.use(
      cors({
        origin: this.baseUrl,
        credentials: true,
      })
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    passport.use(this.authPassport.createJwtStrategy())
    this.app.use(passport.initialize())
    this.app.use(this.middlewares.requestLoggerMiddleware)
    this.app.use(this.middlewares.errorHandlerMiddleware)
    this.logger.info('Application middlewares registered successfully')
  }

  private registerRoutes = () => {
    this.app.use('/healthchecks', new HealthcheckController().getRouter())
    this.app.use(
      '/users',
      new UserController(
        this.userService,
        this.authPassport,
        this.authUtils
      ).getRouter()
    )
    this.logger.info('Application routes registered successfully')
  }

  private startServer = () => {
    return new Promise<void>((resolve) => {
      this.app.listen(this.port, this.host, () => {
        this.logger.info(`Application server running on ${this.baseUrl}`)
        resolve()
      })
    })
  }

  public initialize = async () => {
    this.logger.info('Initializing application')
    await this.connectDatabase()
    this.registerMiddlewares()
    this.registerRoutes()
    await this.startServer()
  }
}

export { App }
