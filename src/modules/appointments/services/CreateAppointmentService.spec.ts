import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../irepositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository()
      createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
   })


   it('should be able to create a new appointment', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime()
      })

      const appointment = await createAppointment.execute({
         date: new Date(2020, 4, 10, 13),
         provider_id: '123456789',
         user_id: 'user_id'
      })

      expect(appointment).toHaveProperty('id')
      expect(appointment.provider_id).toBe('123456789')
   })
   

   it('should not be able to create two appointment on the same time',async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 8).getTime()
      })

      const appointmentDate = new Date(2020, 4, 10, 11) // 11 da manhã do dia 10 de Maio/2020

      await createAppointment.execute({
         date: appointmentDate,
         provider_id: '123456789',
         user_id: 'user_id'
      })

      await expect(createAppointment.execute({
         date: appointmentDate,
         provider_id: 'other_provider_id',
         user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to create an appointment on a past date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime()
      })

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 10, 11),
         user_id: 'user_id',
         provider_id: '123123'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should not be able to create an appointment with the same provider and user', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime()
      })

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 10, 13),
         user_id: 'same-id',
         provider_id: 'same-id'
      })).rejects.toBeInstanceOf(AppError)
   })

   it('should not be able to create an appointment before 8:00 or after 17:00', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 10).getTime()
      })

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 11, 7),
         user_id: 'user-id',
         provider_id: 'provider-id'
      })).rejects.toBeInstanceOf(AppError)

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 11, 18),
         user_id: 'user-id',
         provider_id: 'provider-id'
      })).rejects.toBeInstanceOf(AppError)
   })
})