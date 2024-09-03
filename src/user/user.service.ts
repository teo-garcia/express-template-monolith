import { Auth } from '../lib/auth'
import { db } from '../lib/db'
import { logger } from '../lib/logger'
import createError from 'http-errors'
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status'

const UserService = () => {
  const auth = Auth()

  const getAll = async () => {
    try {
      return await db.user.findMany()
    } catch (error) {
      logger.error('Error occurred while retrieving all users', error)
      throw createError(INTERNAL_SERVER_ERROR, 'Failed to retrieve all users')
    }
  }

  const getById = async (id: number) => {
    try {
      const user = await db.user.findUnique({
        where: { id },
      })

      if (!user) {
        throw createError(NOT_FOUND, `User with id ${id} not found`)
      }

      return user
    } catch (error) {
      logger.error(`Error occurred while retrieving user with id ${id}`, error)
      throw createError(
        INTERNAL_SERVER_ERROR,
        `Failed to retrieve user with id ${id}`
      )
    }
  }

  const getByEmail = async (email: string) => {
    try {
      const user = await db.user.findUnique({
        where: { email },
      })

      return user
    } catch (error) {
      logger.error(
        `Error occurred while retrieving user with email ${email}`,
        error
      )
      throw createError(
        INTERNAL_SERVER_ERROR,
        `Failed to retrieve user with email ${email}`
      )
    }
  }

  const create = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: await auth.hashPassword(password),
        },
      })
    } catch (error) {
      logger.error('Error occurred while creating a user', error)
      throw createError(INTERNAL_SERVER_ERROR, 'Failed to create a user')
    }
  }

  const updateById = async (
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const updatedUser = await db.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          email,
          password,
        },
      })

      return updatedUser
    } catch (error) {
      logger.error(`Error occurred while updating user with id ${id}`, error)
      throw createError(
        INTERNAL_SERVER_ERROR,
        `Failed to update user with id ${id}`
      )
    }
  }

  const deleteById = async (id: number) => {
    try {
      const deletedUser = await db.user.delete({
        where: { id },
      })

      return deletedUser
    } catch (error) {
      logger.error(`Error occurred while deleting user with id ${id}`, error)
      throw createError(
        INTERNAL_SERVER_ERROR,
        `Failed to delete user with id ${id}`
      )
    }
  }

  return {
    create,
    deleteById,
    getAll,
    getByEmail,
    getById,
    updateById,
  }
}

export { UserService }
