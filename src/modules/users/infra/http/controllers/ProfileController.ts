import { Request, Response } from 'express'
import { container } from 'tsyringe'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'

export default class ProfileController {
   public async show(request: Request, response: Response): Promise<Response> {
      const showProfile = container.resolve(ShowProfileService)

      const user = await showProfile.execute({ user_id: request.user.id })

      const { password, ...userWithoutPassword } = user

      return response.json(userWithoutPassword)
   }

   
   public async update(request: Request, response: Response): Promise<Response> {
      const { name, email, password, old_password } = request.body

      const updateProfile = container.resolve(UpdateProfileService)

      const user = await updateProfile.execute({
         name: name,
         email: email,
         password: password,
         user_id: request.user.id,
         old_password: old_password
      })

      const { password: removePassword, ...userWithoutPassword } = user

      return response.json(userWithoutPassword)
   }
}