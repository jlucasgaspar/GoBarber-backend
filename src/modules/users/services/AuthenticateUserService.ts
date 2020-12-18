import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../irepositories/IUsersRepository'

type UserWithoutPassword = Omit<User, 'password'>

interface IRequest {
   email: string
   password: string
}

interface IResponse {
   user: UserWithoutPassword
   token: string
}

@injectable()
export default class AuthenticateUserService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository
   ) {}

   public async execute({ email, password }: IRequest): Promise<IResponse> {
      const user = await this.usersRepository.findByEmail(email)

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