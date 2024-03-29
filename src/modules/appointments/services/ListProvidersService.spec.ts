import FakeUsersRepository from '@modules/users/irepositories/fakes/FakeUsersRepository'

import ListProvidersService from './ListProvidersService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let listProviders: ListProvidersService

describe('ListProvidersService', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      listProviders = new ListProvidersService(fakeUsersRepository)
   })


   it('should be able to list the providers', async () => {
      const user1 = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      const user2 = await fakeUsersRepository.create({
         name: 'Jhon Doe 2',
         email: 'jhondoe2@example.com',
         password: '123456'
      })

      const loggedUser = await fakeUsersRepository.create({
         name: 'Jhon Doe Logged',
         email: 'jhondoe_logged@example.com',
         password: '123456'
      })

      const providers = await listProviders.execute({
         user_id: loggedUser.id
      })

      expect(providers).toEqual([user1, user2])
   })
})