import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '../entities/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import AppError from '../errors/AppError'

interface Request {
   date: Date
   provider_id: string
}

export default class CreateAppointmentService {
   public async execute({ date, provider_id }: Request): Promise<Appointment> {
      const appointmentsRepository = getCustomRepository(AppointmentsRepository)

      const appointmentDate = startOfHour(date)

      const findAppointment = await appointmentsRepository.findByDate(appointmentDate)

      if (findAppointment) {
         throw new AppError('This appointment is already booked.')
      }

      const appointment = appointmentsRepository.create({
         provider_id: provider_id,
         date: appointmentDate
      })

      await appointmentsRepository.save(appointment)

      return appointment
   }
}