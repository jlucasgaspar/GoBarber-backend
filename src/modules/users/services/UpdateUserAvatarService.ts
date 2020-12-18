import { injectable, inject } from 'tsyringe'
import path from 'path'
import fs from 'fs'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../irepositories/IUsersRepository'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'

type UserWithoutPassword = Omit<User, 'password'>

interface IRequest {
   user_id: string
   avatarFilename: string
}

@injectable()
export default class UpdateUserAvatarService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository
   ) {}

   public async execute({ user_id, avatarFilename }: IRequest): Promise<UserWithoutPassword> {
      const user = await this.usersRepository.findById(user_id)

      if (!user) {
         throw new AppError('Only authenticated users can change avatar.', 401)
      }

      if (user.avatar) { // -> Delete previous avatar.
         const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
         const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

         if (userAvatarFileExists) {
            await fs.promises.unlink(userAvatarFilePath)
         }
      }

      user.avatar = avatarFilename

      const { password, ...userWithoutPassword } = user

      await this.usersRepository.save(user)

      return userWithoutPassword
   }
}