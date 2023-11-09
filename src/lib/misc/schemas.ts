import { z } from 'zod'

const userSchema = z.object({
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
})

const signUpSchema = userSchema

const signInSchema = z.object({
  email: userSchema.shape.email,
  password: userSchema.shape.password,
})

export { userSchema, signUpSchema, signInSchema }
