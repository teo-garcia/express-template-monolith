import passport from 'passport'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt'
import { UserService } from '../../services/user.service'
import type { User } from '../../entities/user.entity'
import type { StrategyOptions } from 'passport-jwt'

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '123456790',
}

const verifyFn = async (
  jwtPayload: Pick<User, 'id'>,
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

passport.use(new JwtStrategy(strategyOptions, verifyFn))

const authenticate = passport.authenticate('jwt', { session: false })

export { authenticate }
