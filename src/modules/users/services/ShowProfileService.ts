import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../irepositories/IUsersRepository'

import User from '../infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'

interface IRequest {
   user_id: string
}

@injectable()
export default class ShowProfile {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository
   ) {}

   public async execute({ user_id }: IRequest): Promise<User> {
      const user = await this.usersRepository.findById(user_id)

      if (!user) {
         throw new AppError('User not found')
      }

      return user
   }
}