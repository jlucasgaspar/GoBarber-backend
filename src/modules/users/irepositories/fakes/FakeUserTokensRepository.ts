import { v4 } from 'uuid'
import IUserTokensRepository from '../IUserTokensRepository'
import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

export default class FakeUserTokensRepository implements IUserTokensRepository {
   private userTokens: UserToken[] = []

   public async generate(user_id: string): Promise<UserToken> {
      const userToken = new UserToken()

      Object.assign(userToken, {
         id: v4(),
         token: v4(),
         user_id: user_id,
         created_at: new Date(),
         updated_at: new Date()
      })

      this.userTokens.push(userToken)

      return userToken
   }

   public async findByToken(token: string): Promise<UserToken | undefined> {
      const userToken = await this.userTokens.find(usrToken => usrToken.token === token)

      return userToken
   }
}