import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../irepositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

type UserWithoutPassword = Omit<User, "password">

interface IRequest {
   name: string
   email: string
   password: string
}

@injectable()
export default class CreateUserService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider
   ) {}

   public async execute({ name, email, password }: IRequest): Promise<UserWithoutPassword> {
      const checkUserExists = await this.usersRepository.findByEmail(email)

      if (checkUserExists) {
         throw new AppError('E-mail address already used.')
      }

      const hashedPassword = await this.hashProvider.generateHash(password)

      const user = await this.usersRepository.create({
         name: name,
         email: email,
         password: hashedPassword
      })

      const { password: removedPassword, ...userWithoutPassword } = user

      return userWithoutPassword
   }
}