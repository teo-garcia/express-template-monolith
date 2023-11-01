import type { Request, Response } from "express";
import { Router } from "express";

class HealthcheckController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getHealthcheck);
  }

  private async getHealthcheck(_req: Request, res: Response) {
    res.json({
      status: 200,
      message: "OK",
      data: null,
    });
  }

  public getRouter() {
    return this.router;
  }
}

export { HealthcheckController };
