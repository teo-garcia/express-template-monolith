import { db } from '../lib/misc/db'
import { User } from '../entities/user.entity'
import { hashPassword } from '../lib/auth/bcrypt'

const UserService = () => {
  const getAll = async (): Promise<User[]> => {
    return await db.getRepository(User).find()
  }

  const getById = async (id: string): Promise<User | null> => {
    return await db.getRepository(User).findOne({
      where: { id },
    })
  }

  const getByEmail = async (email: string): Promise<User | null> => {
    return await db.getRepository(User).findOne({
      where: { email },
    })
  }

  const create = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const newUser = await db.getRepository(User).create({
      first_name,
      last_name,
      email,
      password: await hashPassword(password),
    })

    await db.getRepository(User).save(newUser)
  }

  const updateById = async (
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<User | undefined> => {
    const user = await db.getRepository(User).findOne({
      where: { id },
    })

    if (!user) return

    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.password = password

    return await db.getRepository(User).save(user)
  }

  const deleteById = async (id: string): Promise<User | undefined> => {
    const user = await db.getRepository(User).findOne({ where: { id } })

    if (!user) return

    return await db.getRepository(User).remove(user)
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
