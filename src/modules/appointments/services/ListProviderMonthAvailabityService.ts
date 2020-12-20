import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../irepositories/IAppointmentsRepository'

interface IRequest {
   provider_id: string
   month: number
   year: number
}

type IResponse = Array<{
   day: number
   available: boolean
}>

@injectable()
export default class ListProviderMonthAvailabityService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
   ) {}

   public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
      const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
         month: month,
         year: year,
         provider_id: provider_id
      })

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

      const eachDayArray = Array.from(
         { length: numberOfDaysInMonth },
         (value, index) => index + 1
      )

      // eachDayArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, .... 28 ou 30 ou 31 - Depende do mês]

      const availability = eachDayArray.map(day => {
         const appointmentsInDay = appointments.filter(appointment => {
            return getDate(appointment.date) === day
         })

         return {
            day: day,
            available: appointmentsInDay.length < 10
         }
      })

      return availability
   }
}