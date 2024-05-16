import { db } from 'lib/db'
import { App } from './app'
import { logger, requestsLogger } from 'lib/logger'

const app = App(db, logger, requestsLogger)

app.connectDatabase()
app.registerMiddlewares()
app.registerRoutes()
app.startServer()
