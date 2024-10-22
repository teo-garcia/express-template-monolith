import bcrypt from 'bcryptjs'
import passport from 'passport'
import type { StrategyOptions } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt'
import { UserService } from 'modules/user/user.service'

class AuthUtils {
  private saltRounds: number
  private signKey: string

  constructor(saltRounds: number, signKey: string) {
    this.saltRounds = saltRounds
    this.signKey = signKey
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    if (!hashedPassword) return false
    return await bcrypt.compare(password, hashedPassword)
  }

  public generateJWT(id: number): string {
    return jwt.sign({ id }, this.signKey, {
      expiresIn: '1h',
    })
  }
}

class AuthPassport {
  private secretKey: string
  private userService: UserService

  constructor(secretKey: string, userService: UserService) {
    this.secretKey = secretKey
    this.userService = userService
  }

  private async verifyFn(jwtPayload: { id: number }, next: VerifiedCallback) {
    try {
      const user = await this.userService.getById(jwtPayload.id)

      if (user) {
        return next(null, user)
      }

      return next(null, false)
    } catch (error) {
      return next(error, false)
    }
  }

  public createJwtStrategy(): JwtStrategy {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secretKey,
    }

    return new JwtStrategy(strategyOptions, this.verifyFn.bind(this))
  }

  public authenticate = passport.authenticate('jwt', { session: false })
}

export { AuthUtils, AuthPassport }
