import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import User from '../entities/User'
import uploadConfig from '../config/upload'
import AppError from '../errors/AppError'

type UserWithoutPassword = Omit<User, 'password'>

interface Request {
   user_id: string
   avatarFilename: string
}

export default class UpdateUserAvatarService {
   public async execute({ user_id, avatarFilename }: Request): Promise<UserWithoutPassword> {
      const usersRepository = getRepository(User)

      const user = await usersRepository.findOne(user_id)

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

      await usersRepository.save(user)

      return userWithoutPassword
   }
}