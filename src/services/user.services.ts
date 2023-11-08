import { db } from '../lib/misc/db'
import { User } from '../entities/user.entity'
import { hashPassword } from '../lib/auth/bcrypt'

export class UserService {
  private userRepository = db.getRepository(User)

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find()
  }

  public async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    })
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    })
  }

  public async createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<void> {
    const newUser = await this.userRepository.create({
      first_name,
      last_name,
      email,
      password: await hashPassword(password),
    })

    await this.userRepository.save(newUser)
  }

  public async updateUser(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) return

    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.password = password

    return await this.userRepository.save(user)
  }

  public async deleteUser(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) return

    return await this.userRepository.remove(user)
  }
}
