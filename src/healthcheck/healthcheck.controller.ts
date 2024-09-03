import { Request, Response, Router } from 'express'

class HealthcheckController {
  private router: Router

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private getHealthcheck = async (_req: Request, res: Response) => {
    res.json({
      status: 200,
      message: 'OK',
      data: null,
    })
  }

  private initializeRoutes = () => {
    this.router.get('/', this.getHealthcheck)
  }

  public getRouter = () => {
    return this.router
  }
}

export { HealthcheckController }
