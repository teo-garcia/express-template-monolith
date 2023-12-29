import type { Request, Response } from 'express'
import { Router } from 'express'
import { UserService } from 'services/user.service'
import { logger } from 'lib/logger'

const UserController = () => {
  const router = Router()

  const getAll = async (req: Request, res: Response) => {
    try {
      const users = await UserService().getAll()
      res.json(users)
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ error: 'Internal Server Error', data: null, status: 500 })
    }
  }

  const getById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)

    try {
      const user = await UserService().getById(userId)
      if (user) {
        res.json({
          data: user,
        })
      } else {
        res
          .status(404)
          .json({ message: 'User not found', data: null, status: 404 })
      }
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ message: 'Internal Server Error', data: null, status: 500 })
    }
  }

  const create = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password } = req.body

    try {
      const newUser = await UserService().create(
        first_name,
        last_name,
        email,
        password
      )
      res.status(201).json(newUser)
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  const updateById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const { first_name, last_name, email, password } = req.body

    try {
      const updatedUser = await UserService().updateById(
        userId,
        first_name,
        last_name,
        email,
        password
      )
      if (updatedUser) {
        res.json(updatedUser)
      } else {
        res
          .status(404)
          .json({ message: 'User not found', status: 404, data: null })
      }
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
      res
        .status(500)
        .json({ message: 'Internal Server Error', status: 500, data: null })
    }
  }

  const deleteById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)

    try {
      const deletedUser = await UserService().deleteById(userId)
      if (deletedUser) {
        res.json({ message: 'User deleted successfully' })
      } else {
        res
          .status(404)
          .json({ message: 'User not found', data: null, status: 404 })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', data: null, status: 500 })
    }
  }

  const initializeRoutes = () => {
    router.get('/', getAll)
    router.get('/:id', getById)
    router.post('/', create)
    router.put('/:id', updateById)
    router.delete('/:id', deleteById)
  }

  initializeRoutes()

  return router
}

export { UserController }
