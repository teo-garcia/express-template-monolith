import type { NextFunction, Request, Response } from 'express'
import { logger } from '../lib/logger'

class CustomError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Ensure the name of this error is the same as the class name
    Error.captureStackTrace(this, this.constructor)
  }
}

const errorHandlerMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500
  const message =
    err instanceof CustomError ? err.message : 'Internal Server Error'
  console.log('hey')

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    payload: null,
  })

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  )

  next()
}

export { errorHandlerMiddleware }
