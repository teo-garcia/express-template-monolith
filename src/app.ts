import 'dotenv/config'
import express, { RequestHandler } from 'express'
import cors from 'cors'
import passport from 'passport'
import { UserController } from 'controllers/user.controller'
import { AuthController } from 'controllers/auth.controller'
import { HealthcheckController } from 'controllers/healthcheck.controller'
import type { PrismaClient } from '@prisma/client'
import type { Logger } from 'winston'

const App = (
  db: PrismaClient,
  logger: Logger,
  requestsLogger: RequestHandler
) => {
  const host = process.env?.SERVER_HOST || '0.0.0.0'
  const port = parseInt(process.env?.PORT as string) || 3000
  const baseUrl = `http://${host}:${port}`
  const app = express()

  const connectDatabase = async () => {
    try {
      await db.$connect()
      logger.info('Database connection successful')
    } catch (error) {
      logger.error('Database connection error')
      if (error instanceof Error) logger.error(error.message)
      throw error
    }
  }

  const registerMiddlewares = () => {
    app.use(
      cors({
        origin: baseUrl,
        credentials: true,
      })
    )
    app.use(express.json())
    app.use(passport.initialize())
    app.use(requestsLogger)
    logger.info('Application middlewares registered successfully')
  }

  const registerRoutes = () => {
    app.use('/healthcheck', HealthcheckController())
    app.use('/users', UserController())
    app.use('/auth', AuthController())
    logger.info('Application routes registered successfully')
  }

  const startServer = () => {
    return new Promise<void>((resolve) => {
      app.listen(port, host, () => {
        logger.info(`Application server running on ${baseUrl}`)
        resolve()
      })
    })
  }

  return {
    connectDatabase,
    registerMiddlewares,
    registerRoutes,
    startServer,
    app,
  }
}

export { App }
