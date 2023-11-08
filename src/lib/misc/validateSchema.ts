import type { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

const validateSchema =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body.data)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ data: null, message: 'Error, invalid schema', status: 400 })
      } else {
        next(error)
      }
    }
  }

export { validateSchema }
