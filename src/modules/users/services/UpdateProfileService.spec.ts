import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import UpdateProfileService from './UpdateProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      fakeHashProvider = new FakeHashProvider()

      updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
   })


   it('should be able to update the profile', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'Jhon Trê',
         email: 'jhontre@example.com'
      })

      expect(updatedUser.name).toBe('Jhon Trê')
      expect(updatedUser.email).toBe('jhontre@example.com')
   })

   it('should not be able to update the profile of a non existing user', async () => {
      await expect(updateProfile.execute({
         user_id: 'user_that_does_not_exists',
         name: 'Test',
         email: 'test@example.com'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to update to an existing  e-mail', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      await fakeUsersRepository.create({
         name: 'Test',
         email: 'test@example.com',
         password: '123456'
      })

      await expect(updateProfile.execute({
         user_id: user.id,
         name: 'test',
         email: 'test@example.com'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should be able to update the password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: 'old_password'
      })

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'Jhon Trê',
         email: 'jhontre@example.com',
         old_password: 'old_password',
         password: 'new_password'
      })

      expect(updatedUser.password).toBe('new_password')
   })


   it('should not be able to update the password without the old password info', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: 'old_password'
      })

      await expect(updateProfile.execute({
         user_id: user.id,
         name: 'Jhon Trê',
         email: 'jhontre@example.com',
         password: 'new_password'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to update the password with the wrong old password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: 'old_password'
      })

      await expect(updateProfile.execute({
         user_id: user.id,
         name: 'Jhon Trê',
         email: 'jhontre@example.com',
         old_password: 'old_password_wrong',
         password: 'new_password'
      })).rejects.toBeInstanceOf(AppError)
   })
})