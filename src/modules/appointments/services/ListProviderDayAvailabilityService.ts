import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../irepositories/IAppointmentsRepository'

interface IRequest {
   provider_id: string
   day: number
   month: number
   year: number
}

type IResponse = Array<{
   hour: number
   available: boolean
}>

@injectable()
export default class ListProviderDayAvailabityService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
   ) {}

   public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse> {
      const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
         provider_id: provider_id,
         year: year,
         month: month,
         day: day
      })

      const hourStart = 8

      const eachHourArray = Array.from(
         { length: 10 },
         (value, index) => index + hourStart
      ) // eachHourArray = [8, 9, 10, 11.. 18] Acaba em 18 pq tem length de 10
      
      const currentDate = new Date(Date.now())
      
      const availability = eachHourArray.map(hour => {
         const hasAppointmentInHour = appointments.find(appointment => 
            getHours(appointment.date) === hour
         )

         const compareDate = new Date(year, month - 1, day, hour)

         return {
            hour: hour,
            available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
            // esse isAfter() é pra garantir que só pode mostrar os horários livres do futuro
         }
      })

      
      return availability
   }
}