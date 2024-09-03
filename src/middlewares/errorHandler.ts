import type { Request, Response, ErrorRequestHandler } from 'express'
import { logger } from '../lib/logger'

interface CustomError extends Error {
  statusCode?: number
}

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err

  logger.error(message)

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}

export { errorHandler }
