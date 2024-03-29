import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'

export default class ProviderDayAvailabilityService {
   public async index(request: Request, response: Response): Promise<Response> {
      const { provider_id } = request.params
      const { day, month, year } = request.body

      const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService)

      const availability = await listProviderDayAvailability.execute({
         day: day,
         month: month,
         year: year,
         provider_id: provider_id
      })

      return response.json(availability)
   }
}