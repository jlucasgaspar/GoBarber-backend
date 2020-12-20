import { startOfHour, isBefore, getHours } from 'date-fns'
import { inject, injectable } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../irepositories/IAppointmentsRepository'
import AppError from '@shared/errors/AppError'

interface IRequest {
   date: Date
   provider_id: string
   user_id: string
}

@injectable()
export default class CreateAppointmentService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
   ) {}

   public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
      const appointmentDate = startOfHour(date)

      if (isBefore(appointmentDate, Date.now())) {
         throw new AppError("You can't create an appointment on a past date")
      }

      if (user_id === provider_id) {
         throw new AppError('You can not create an appointment with yourself')
      }

      if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
         throw new AppError('You can only create appointments between 8am and 5pm')
      }

      const findAppointment = await this.appointmentsRepository.findByDate(appointmentDate)

      if (findAppointment) {
         throw new AppError('This appointment is already booked.')
      }

      const appointment = await this.appointmentsRepository.create({
         user_id: user_id,
         provider_id: provider_id,
         date: appointmentDate
      })

      return appointment
   }
}