import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../entities/User'
import AppError from '../errors/AppError'

type UserWithoutPassword = Omit<User, "password">

interface Request {
   name: string
   email: string
   password: string
}

export default class CreateUserService {
   public async execute({ name, email, password }: Request): Promise<UserWithoutPassword> {
      const usersRepository = getRepository(User)

      const checkUserExists = await usersRepository.findOne({
         where: { email: email }
      })

      if (checkUserExists) {
         throw new AppError('E-mail address already used.')
      }

      const hashedPassword = await hash(password, 8)

      const user = usersRepository.create({
         name: name,
         email: email,
         password: hashedPassword
      })

      await usersRepository.save(user)

      const { password: removedPassword, ...userWithoutPassword } = user

      return userWithoutPassword
   }
}