import bcrypt from 'bcryptjs'

const comparePasswords = async (
  password: string,
  hashedPassword: string = ''
) => {
  return await bcrypt.compare(password, hashedPassword)
}

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export { comparePasswords, hashPassword }
