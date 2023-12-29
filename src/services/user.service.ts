import { hashPassword } from 'lib/auth'
import { db } from 'lib/db'

const UserService = () => {
  const getAll = async () => {
    return await db.user.findMany()
  }

  const getById = async (id: number) => {
    return await db.user.findUnique({
      where: { id },
    })
  }

  const getByEmail = async (email: string) => {
    return await db.user.findUnique({
      where: { email },
    })
  }

  const create = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> => {
    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hashPassword(password),
      },
    })
  }

  const updateById = async (
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
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
  }

  const deleteById = async (id: number) => {
    const deletedUser = await db.user.delete({
      where: { id },
    })

    return deletedUser
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
