import bcrypt from 'bcryptjs'

import passport from 'passport'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt'
import { UserService } from '../services/user.service'
import type { StrategyOptions } from 'passport-jwt'
import jwt from 'jsonwebtoken'

const comparePasswords = async (password: string, hashedPassword: string) => {
  if (!hashedPassword) return false

  return await bcrypt.compare(password, hashedPassword)
}

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const generateJWT = (id: number) => {
  // TODO: Handle sign key properly
  return jwt.sign({ id }, '1234567890', {
    expiresIn: '1h',
  })
}

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '123456790',
}

const verifyFn = async (jwtPayload: { id: number }, next: VerifiedCallback) => {
  try {
    const user = await UserService().getById(jwtPayload.id)

    if (user) {
      return next(null, user)
    }

    return next(null, false)
  } catch (error) {
    return next(error, false)
  }
}

passport.use(new JwtStrategy(strategyOptions, verifyFn))

const authenticate = passport.authenticate('jwt', { session: false })

export { comparePasswords, hashPassword, generateJWT, authenticate }
