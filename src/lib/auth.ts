import bcrypt from 'bcryptjs'
import passport from 'passport'
import { UserService } from 'services/user.service'
import type { StrategyOptions } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt'

const Auth = () => {
  const saltRounds = 10
  const signKey = '1234567890'
  const secretKey = '123456790'

  const comparePasswords = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    if (!hashedPassword) return false
    return await bcrypt.compare(password, hashedPassword)
  }

  const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds)
  }

  const generateJWT = (id: number): string => {
    return jwt.sign({ id }, signKey, {
      expiresIn: '1h',
    })
  }

  const verifyFn = async (
    jwtPayload: { id: number },
    next: VerifiedCallback
  ) => {
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

  const createJwtStrategy = (): JwtStrategy => {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    }

    return new JwtStrategy(strategyOptions, verifyFn)
  }

  const authenticate = passport.authenticate('jwt', { session: false })

  return {
    comparePasswords,
    hashPassword,
    generateJWT,
    createJwtStrategy,
    authenticate,
  }
}

export { Auth }
