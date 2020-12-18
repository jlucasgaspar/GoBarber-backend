import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import authConfig from '../config/auth'
import User from '../entities/User'
import AppError from '../errors/AppError'

type UserWithoutPassword = Omit<User, 'password'>

interface Request {
   email: string
   password: string
}

interface Response {
   user: UserWithoutPassword
   token: string
}

export default class AuthenticateUserService {
   public async execute({ email, password }: Request): Promise<Response> {
      const usersRepository = getRepository(User)

      const user = await usersRepository.findOne({
         where: { email: email }
      })

      if (!user) {
         throw new AppError('Incorrect e-mail/password combinantion.', 401)
      }
      
      const passwordMatched = await compare(password, user.password)
      
      if (!passwordMatched) {
         throw new AppError('Invalid e-mail/password combinantion.', 401)
      }

      const { jwt } = authConfig

      const token = sign({}, jwt.secret, {
         subject: user.id,
         expiresIn: jwt.expiresIn
      })

      const { password: removedPassword, ...userWithoutPassword } = user

      return {
         user: userWithoutPassword,
         token: token
      }
   }
}