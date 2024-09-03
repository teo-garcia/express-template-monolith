import 'dotenv/config'
import { db } from './lib/db'
import { App } from './app'
import { logger } from './lib/logger'
import { errorHandler } from './middlewares/errorHandler'
import { requestLogger } from './middlewares/requestLogger'

const middlewares = {
  requestLogger,
  errorHandler,
}

const app = new App(db, logger, middlewares)

app.initialize()
