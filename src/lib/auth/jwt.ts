import jwt from 'jsonwebtoken'
import type { User } from '../../entities/user.entity'

const generateJWT = (user: User) =>
  jwt.sign({ id: user.id }, '1234567890', {
    expiresIn: '1h',
  })

export { generateJWT }
