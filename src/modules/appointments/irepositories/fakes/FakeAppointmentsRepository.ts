import { v4 } from 'uuid'
import { isEqual } from 'date-fns'

import IAppointmentsRepository from "@modules/appointments/irepositories/IAppointmentsRepository"
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '../../infra/typeorm/entities/Appointment'

export default class FakeAppointmentsRepository implements IAppointmentsRepository {
   private appointments: Appointment[] = []

   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const appointment = this.appointments.find(appointment =>
         isEqual(appointment.date, date)
      )

      return appointment
   }

   
   public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = new Appointment()

      Object.assign(appointment, {
         id: v4(),
         provider_id: provider_id,
         date: date
      })

      this.appointments.push(appointment)

      return appointment
   }
}