import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import passport from 'passport'

import { UserController } from 'controllers/user.controller'
import { AuthController } from 'controllers/auth.controller'
import { HealthcheckController } from 'controllers/healthcheck.controller'

import { db } from 'lib/db'
import { logger, requestsLogger } from 'lib/logger'

const host = process.env?.SERVER_HOST || '0.0.0.0'
const port = parseInt(process.env?.PORT as string) || 3000
const baseUrl = `http://${host}:${port}`
const app = express()

db.$connect()
  .then(() => {
    logger.info('database connection successfully')
  })
  .catch((error: Error) => {
    logger.error(error.message)
    logger.error('database connection error')
  })

app.use(
  cors({
    origin: baseUrl,
    credentials: true,
  })
)
app.use(express.json())
app.use(passport.initialize())
app.use(requestsLogger)

logger.info('application middlewares registered successfully')

app.use('/healthcheck', HealthcheckController())
app.use('/users', UserController())
app.use('/auth', AuthController())

logger.info('application routes registered successfully')

app.listen(port, host, () => {
  logger.info(`application server running on ${baseUrl}`)
})

export { app }
