import { logger } from '../lib/logger'
import type { RequestHandler } from 'express'

const requestLoggerMiddleware: RequestHandler = (req, _res, next) => {
  const message = `Incoming ${req.method} ${req.path}`

  logger.info(message)

  next()
}

export { requestLoggerMiddleware }
