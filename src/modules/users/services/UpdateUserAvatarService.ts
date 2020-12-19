import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../irepositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

import User from '../infra/typeorm/entities/User'

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
      private usersRepository: IUsersRepository,

      @inject('StorageProvider')
      private storageProvider: IStorageProvider
   ) {}

   public async execute({ user_id, avatarFilename }: IRequest): Promise<UserWithoutPassword> {
      const user = await this.usersRepository.findById(user_id)

      if (!user) {
         throw new AppError('Only authenticated users can change avatar.', 401)
      }

      if (user.avatar) {
         await this.storageProvider.deleteFile(user.avatar)
      }

      const filename = await this.storageProvider.saveFile(avatarFilename)

      user.avatar = filename

      const { password, ...userWithoutPassword } = user

      await this.usersRepository.save(user)

      return userWithoutPassword
   }
}