import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import { HealthcheckController } from './controllers/healthcheck.controller'
import { UserController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { db } from './lib/misc/db'
import { logger, requestsLogger } from './lib/misc/logger'

const host = process.env?.SERVER_HOST || '0.0.0.0'
const port = parseInt(process.env?.PORT as string) || 3000
const baseUrl = `http://${host}:${port}`
const app = express()

db.initialize()
  .then(() => {
    logger.info('database connection successfully')
  })
  .catch((err) => {
    logger.error(err)
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

logger.info('middlewares registered successfully')

app.use('/healthcheck', HealthcheckController())
app.use('/users', UserController())
app.use('/auth', AuthController())

app.listen(port, host, () => {
  logger.info(`server running on ${baseUrl}`)
})

export { app }
