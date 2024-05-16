import 'dotenv/config'
import { db } from '../src/lib/db'
import { Auth } from '../src/lib/auth'
import { logger } from '../src/lib/logger'

const auth = Auth()

const seed = async () => {
  // const isDevelopment = process.env.NODE_ENV === 'development'

  // if (!isDevelopment) {
  //   logger.error(
  //     'Seed script is only intended for development environments. Skipping...'
  //   )
  //   return
  // }
  logger.info('creating seed data')
  const hashedAdminPassword = await auth.hashPassword('mode')

  const adminUser = {
    firstName: 'Mateo',
    lastName: 'Garcia',
    email: 'god@etm.com',
    password: hashedAdminPassword,
    role: 'admin',
  }
  await db.user.deleteMany()
  await db.user.create({
    data: adminUser,
  })

  for (let i = 1; i <= 9; i++) {
    const userEmail = `user${i}@etm.com`
    const userPassword = 'your_user_password'
    const hashedUserPassword = await auth.hashPassword(userPassword)

    await db.user
      .create({
        data: {
          firstName: `User${i}`,
          lastName: 'Doe',
          email: userEmail,
          password: hashedUserPassword,
        },
      })
      .then((user) => logger.info(`user ${user.email} created`))
  }

  logger.info('seed data created successfully')
}

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (error: Error) => {
    logger.error(`error creating seed data`, error)
    await db.$disconnect()
    process.exit(1)
  })
