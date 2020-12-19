import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
   it('should be able to authenticate an user', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeHashProvider = new FakeHashProvider()

      const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHashProvider
      )

      const user = await createUser.execute({
         name: 'Jhon Doe',
         email: 'jhon.doe@email.com',
         password: '123456'
      })

      const response = await authenticateUser.execute({
         email: 'jhon.doe@email.com',
         password: '123456'
      })

      expect(response).toHaveProperty('token')
      expect(response.user).toEqual(user)
   })


   it('should not be able to authenticate with a non existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeHashProvider = new FakeHashProvider()

      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHashProvider
      )

      expect(authenticateUser.execute({
         email: 'jhon.doe@email.com',
         password: '123456'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to authenticate with wrong password', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeHashProvider = new FakeHashProvider()

      const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHashProvider
      )

      await createUser.execute({
         name: 'Jhon Doe',
         email: 'jhon.doe@email.com',
         password: '123456'
      })

      expect(authenticateUser.execute({
         email: 'jhon.doe@email.com',
         password: '123456_wrong_password'
      })).rejects.toBeInstanceOf(AppError)
   })
})