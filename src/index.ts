import 'dotenv/config'
import { db } from './lib/db'
import { App } from './app'
import { logger } from './lib/logger'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware'
import { requestLoggerMiddleware } from './middlewares/requestLoggerMiddleware'

const middlewares = {
  requestLoggerMiddleware,
  errorHandlerMiddleware,
}

const app = new App(db, logger, middlewares)

app.initialize()
