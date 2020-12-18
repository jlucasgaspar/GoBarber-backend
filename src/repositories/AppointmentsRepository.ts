import { EntityRepository, Repository } from 'typeorm'
import Appointment from '../entities/Appointment'

@EntityRepository(Appointment)
export default class AppointmentsRepository extends Repository<Appointment> {
   public async findByDate(date: Date): Promise<Appointment | undefined | null> {
      const findAppointment = await this.findOne({
         where: { date: date }
      })

      return findAppointment
   }
}