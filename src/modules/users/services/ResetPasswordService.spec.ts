import FakeUserTokensRepository from '../irepositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import ResetPasswordService from './ResetPasswordService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPasswordService', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      fakeUserTokensRepository = new FakeUserTokensRepository()
      fakeHashProvider = new FakeHashProvider
      
      resetPassword = new ResetPasswordService(
         fakeUsersRepository,
         fakeUserTokensRepository,
         fakeHashProvider
      )
   })


   it('should be able to reset the password', async () => {         
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: 'old_password'
      })

      const { token } = await fakeUserTokensRepository.generate(user.id)

      const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

      await resetPassword.execute({
         token: token,
         password: 'new_password'
      })

      const updatedUser = await fakeUsersRepository.findById(user.id)

      expect(generateHash).toHaveBeenCalledWith('new_password')
      expect(updatedUser?.password).toBe('new_password')
   })


   it('should not be able to reset the password with a non-existing token', async () => {
      await expect(
         resetPassword.execute({
            token: 'non-existing-token',
            password: '123456'
         })
      ).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to reset the password with a non-existing user', async () => {
      const { token } = await fakeUserTokensRepository.generate('string-of-invalid-user')

      await expect(
         resetPassword.execute({
            token: token,
            password: '123456'
         })
      ).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to reset the password after more than 2 hours', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: 'old_password'
      })

      const { token } = await fakeUserTokensRepository.generate(user.id)

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         const customDate = new Date()

         return customDate.setHours(customDate.getHours() + 3)
      })

      await expect(resetPassword.execute({
         token: token,
         password: 'new_password_after_2h'
      })).rejects.toBeInstanceOf(AppError)
   })
})