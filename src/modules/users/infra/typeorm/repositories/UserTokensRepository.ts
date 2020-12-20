import { getRepository, Repository } from 'typeorm'

import IUserTokensRepository from '@modules/users/irepositories/IUserTokensRepository'
import UserToken from '../entities/UserToken'

export default class UserTokensRepository implements IUserTokensRepository {
   private ormRepository: Repository<UserToken>
   
   constructor() {
      this.ormRepository = getRepository(UserToken)
   }

   public async generate(user_id: string): Promise<UserToken> {
      const userToken = await this.ormRepository.create({ user_id: user_id })

      await this.ormRepository.save(userToken)

      return userToken
   }

   public async findByToken(token: string): Promise<UserToken | undefined> {
      const userToken = await this.ormRepository.findOne({
         where: { token: token }
      })

      return userToken
   }
}