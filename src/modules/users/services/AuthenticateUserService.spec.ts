import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      fakeHashProvider = new FakeHashProvider()

      createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
      authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)
   })


   it('should be able to authenticate an user', async () => {
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
      await expect(authenticateUser.execute({
         email: 'jhon.doe@email.com',
         password: '123456'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to authenticate with wrong password', async () => {
      await createUser.execute({
         name: 'Jhon Doe',
         email: 'jhon.doe@email.com',
         password: '123456'
      })

      await expect(authenticateUser.execute({
         email: 'jhon.doe@email.com',
         password: '123456_wrong_password'
      })).rejects.toBeInstanceOf(AppError)
   })
})