import express from 'express'
import cors from 'cors'
import passport from 'passport'
import { HealthcheckController } from './controllers/healthcheck.controller'
import { UserController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { db } from './lib/db'
import { logger, requestsLogger } from './lib/logger'

const port = process.env.PORT || 3001
const app = express()

db.initialize()
  .then(() => {
    logger.info('database connection successfully')
  })
  .catch(() => {
    logger.error('database connection error')
  })

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())
app.use(passport.initialize())
app.use(requestsLogger)

logger.info('middlewares registered successfully')

app.use('/healthcheck', new HealthcheckController().getRouter())
app.use('/users', new UserController().getRouter())
app.use('/auth', new AuthController().getRouter())

app.listen(port, () => {
  logger.info(`http server running on ${port}`)
})
