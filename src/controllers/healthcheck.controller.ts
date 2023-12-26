import type { Request, Response } from 'express'
import { Router } from 'express'

const HealthcheckController = () => {
  const router = Router()

  const getHealthcheck = async (_req: Request, res: Response) => {
    res.json({
      status: 200,
      message: 'OK',
      data: null,
    })
  }

  const initializeRoutes = () => {
    router.get('/', getHealthcheck)
  }

  initializeRoutes()

  return router
}

export { HealthcheckController }
