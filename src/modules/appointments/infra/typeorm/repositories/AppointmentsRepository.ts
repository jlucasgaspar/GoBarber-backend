import { getRepository, Repository, Raw } from 'typeorm'

import Appointment from '../entities/Appointment'
import IAppointmentsRepository from "@modules/appointments/irepositories/IAppointmentsRepository"
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

class AppointmentsRepository implements IAppointmentsRepository {
   private ormRepository: Repository<Appointment>
   
   constructor() {
      this.ormRepository = getRepository(Appointment)
   }


   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const findAppointment = await this.ormRepository.findOne({
         where: { date: date }
      })

      return findAppointment
   }

   public async findAllInMonthFromProvider(
      { month, provider_id, year }: IFindAllInMonthFromProviderDTO
   ): Promise<Appointment[]> {
      const parsedMonth = String(month).padStart(2, '0')

      const appointments = await this.ormRepository.find({
         where: {
            provider_id: provider_id,
            date: Raw(dateFieldName => 
               `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
            )
         }
      })

      console.log("appointments: ", appointments)

      return appointments
   }

   public async findAllInDayFromProvider(
      { month, provider_id, year, day }: IFindAllInDayFromProviderDTO
   ): Promise<Appointment[]> {
      const parsedDay = String(day).padStart(2, '0')
      const parsedMonth = String(month).padStart(2, '0')

      const appointments = await this.ormRepository.find({
         where: {
            provider_id: provider_id,
            date: Raw(dateFieldName => 
               `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
            )
         }
      })

      return appointments
   }
   
   public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = this.ormRepository.create({
         provider_id: provider_id,
         user_id: user_id,
         date: date
      })

      await this.ormRepository.save(appointment)

      return appointment
   }
}

export default AppointmentsRepository