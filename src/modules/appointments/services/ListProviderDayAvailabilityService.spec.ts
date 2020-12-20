import FakeAppointmentsRepository from '@modules/appointments/irepositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'
import AppError from '@shared/errors/AppError'

let listProviderDayAvailabity: ListProviderDayAvailabilityService
let fakeAppointmentsRepository: FakeAppointmentsRepository

describe('ListProviderDayAvailabity', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository()

      listProviderDayAvailabity = new ListProviderDayAvailabilityService(
         fakeAppointmentsRepository
      )
   })


   it('should be able to list the day availabity from providers', async () => {
      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         user_id: 'user_id',
         date: new Date(2020, 4, 20, 14, 0, 0)
      })

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         user_id: 'user_id',
         date: new Date(2020, 4, 20, 15, 0, 0)
      })
      
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 20, 11).getTime()
      })

      const availability = await listProviderDayAvailabity.execute({
         provider_id: 'user',
         year: 2020,
         month: 5,
         day: 20
      })

      expect(availability).toEqual(expect.arrayContaining([
         { hour: 8, available: false },
         { hour: 9, available: false },
         { hour: 10, available: false },
         { hour: 13, available: true },
         { hour: 14, available: false },
         { hour: 15, available: false },
         { hour: 16, available: true },
      ]))
   })


   /* it('should not be able to list the day availabity from providers in the past', async () => {
      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         date: new Date(2020, 4, 20, 8, 0, 0)
      })

      await fakeAppointmentsRepository.create({
         provider_id: 'user',
         date: new Date(2020, 4, 20, 10, 0, 0)
      })

      const availability = await listProviderDayAvailabity.execute({
         provider_id: 'user',
         year: 2020,
         month: 5,
         day: 20
      })

      expect(availability).toEqual(expect.arrayContaining([
         { hour: 8, available: false },
         { hour: 9, available: true },
         { hour: 10, available: false },
         { hour: 11, available: true },
      ]))
   }) */
})