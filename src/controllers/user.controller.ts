import type { Request, Response } from 'express'
import { Router } from 'express'
import { UserService } from '../services/user.services'

export class UserController {
  private userService: UserService
  private router: Router

  constructor() {
    this.userService = new UserService()
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // this.router.get('/', this.getAllUsers)
    // this.router.get('/:id', this.getUserById)
    // this.router.post('/', this.createUser)
    // this.router.put('/:id', this.updateUser)
    // this.router.delete('/:id', this.deleteUser)
  }

  // public getAllUsers = async (req: Request, res: Response) => {
  //   try {
  //     const users = await this.userService.getAllUsers()
  //     res.json(users)
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal Server Error' })
  //   }
  // }

  // public getUserById = async (req: Request, res: Response) => {
  //   const userId = req.params.id

  //   try {
  //     const user = await this.userService.getUserById(userId)
  //     if (user) {
  //       res.json(user)
  //     } else {
  //       res.status(404).json({ error: 'User not found' })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal Server Error' })
  //   }
  // }

  // public createUser = async (req: Request, res: Response) => {
  //   const { first_name, last_name, email, password } = req.body

  //   try {
  //     const newUser = await this.userService.createUser(
  //       first_name,
  //       last_name,
  //       email,
  //       password
  //     )
  //     res.status(201).json(newUser)
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal Server Error' })
  //   }
  // }

  // public updateUser = async (req: Request, res: Response) => {
  //   const userId = req.params.id
  //   const { first_name, last_name, email, password } = req.body

  //   try {
  //     const updatedUser = await this.userService.updateUser(
  //       userId,
  //       first_name,
  //       last_name,
  //       email,
  //       password
  //     )
  //     if (updatedUser) {
  //       res.json(updatedUser)
  //     } else {
  //       res.status(404).json({ message: 'User not found' })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: 'Internal Server Error' })
  //   }
  // }

  // public deleteUser = async (req: Request, res: Response) => {
  //   const userId = req.params.id

  //   try {
  //     const deletedUser = await this.userService.deleteUser(userId)
  //     if (deletedUser) {
  //       res.json({ message: 'User deleted successfully' })
  //     } else {
  //       res.status(404).json({ message: 'User not found' })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: 'Internal Server Error' })
  //   }
  // }

  public getRouter() {
    return this.router
  }
}
