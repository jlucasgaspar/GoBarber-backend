import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'

describe('CreateUser', () => {
   it('should be able to create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeHashProvider = new FakeHashProvider()

      const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)

      const user = await createUser.execute({
         name: 'Jhon Doe',
         email: 'jhondoe@example.como',
         password: '123456'
      })

      expect(user).toHaveProperty('id')
   })

   it('should not be able to create a new user with same email from another', async () => {
      const fakeUsersRepository = new FakeUsersRepository()
      const fakeHashProvider = new FakeHashProvider()

      const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)

      await createUser.execute({
         name: 'Jhon Doe',
         email: 'jhondoe@example.como',
         password: '123456'
      })

      expect(createUser.execute({
         name: 'Jhon Doe 2',
         email: 'jhondoe@example.como',
         password: '123456'
      })).rejects.toBeInstanceOf(AppError)
   })
})