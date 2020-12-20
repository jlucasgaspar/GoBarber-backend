import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'

import ShowProfileService from './ShowProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('ShowProfileService', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      showProfile = new ShowProfileService(fakeUsersRepository)
   })


   it('should be able to show the profile', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      const profile = await showProfile.execute({
         user_id: user.id
      })

      expect(profile.name).toBe('Jhon Doe')
      expect(profile.email).toBe('jhondoe@example.com')
   })


   it('should not be able to show the profile of a non existing user', async () => {
      await expect(showProfile.execute({
         user_id: 'user_that_does_not_exists'
      })).rejects.toBeInstanceOf(AppError)
   })
})