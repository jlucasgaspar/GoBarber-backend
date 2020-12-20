import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderMonthAvailabityService from '@modules/appointments/services/ListProviderMonthAvailabityService'

export default class ProviderMonthAvailabilityService {
   public async index(request: Request, response: Response): Promise<Response> {
      const { provider_id } = request.params
      const { month, year } = request.body

      const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabityService)

      const availability = await listProviderMonthAvailability.execute({
         year: year,
         month: month,
         provider_id: provider_id
      })

      return response.json(availability)
   }
}