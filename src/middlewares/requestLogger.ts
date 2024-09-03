import { logger } from '../lib/logger'
import type { RequestHandler } from 'express'

const requestLogger: RequestHandler = (req, _res, next) => {
  const { method, path } = req

  const message = `Incoming ${method} ${path}`

  logger.info(message)

  next()
}

export { requestLogger }
