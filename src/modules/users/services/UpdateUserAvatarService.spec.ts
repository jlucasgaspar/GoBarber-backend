import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from './UpdateUserAvatarService'
import AppError from '@shared/errors/AppError'

describe('UpdateUserAvatar', () => {
   it('should be able to create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeStorageProvider = new FakeStorageProvider()

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider
      )

      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'avatar.jpg'
      })

      expect(user.avatar).toBe('avatar.jpg')
   })


   it('should delete old avatar when updating new one.', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeStorageProvider = new FakeStorageProvider()

      const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider
      )

      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'avatar.jpg'
      })

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFilename: 'new_avatar.jpg'
      })

      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
      expect(user.avatar).toBe('new_avatar.jpg')
   })


   it('should not be able to update avatar from non existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeStorageProvider = new FakeStorageProvider()

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider
      )

      expect(updateUserAvatar.execute({
         user_id: 'non-existing-user',
         avatarFilename: 'avatar.jpg'
      })).rejects.toBeInstanceOf(AppError)
   })
})