import { v4 } from 'uuid'
import User from '../../infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/irepositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

export default class FakeUsersRepository implements IUsersRepository {
   private users: User[] = []

   public async findById(id: string): Promise<User | undefined> {
      const user = this.users.find(user => user.id === id)

      return user
   }

   public async findByEmail(email: string): Promise<User | undefined> {
      const user = this.users.find(user => user.email === email)

      return user
   }
   
   public async create({ email, password, name }: ICreateUserDTO): Promise<User> {
      const user = new User()

      Object.assign(user, {
         id: v4(),
         email: email,
         password: password,
         name: name
      })

      this.users.push(user)

      return user
   }

   public async save(userData: User): Promise<User> {
      const findIndex = this.users.findIndex(user => user.id === userData.id)

      this.users[findIndex] = userData

      return userData
   }
}