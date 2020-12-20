import { v4 } from 'uuid'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/irepositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '../../infra/typeorm/entities/Appointment'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

export default class FakeAppointmentsRepository implements IAppointmentsRepository {
   private appointments: Appointment[] = []

   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const appointment = this.appointments.find(appointment =>
         isEqual(appointment.date, date)
      )

      return appointment
   }


   public async findAllInMonthFromProvider(
      { month, provider_id, year }: IFindAllInMonthFromProviderDTO
   ): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => 
         appointment.provider_id === provider_id &&
         getMonth(appointment.date) + 1 === month &&
         getYear(appointment.date) === year
      )

      return appointments
   }

   public async findAllInDayFromProvider(
      { provider_id, day, month, year }: IFindAllInDayFromProviderDTO
   ): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => 
         appointment.provider_id === provider_id &&
         getDate(appointment.date) === day &&
         getMonth(appointment.date) + 1 === month &&
         getYear(appointment.date) === year
      )

      return appointments
   }


   public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = new Appointment()

      Object.assign(appointment, {
         id: v4(),
         provider_id: provider_id,
         user_id: user_id,
         date: date
      })

      this.appointments.push(appointment)

      return appointment
   }
}