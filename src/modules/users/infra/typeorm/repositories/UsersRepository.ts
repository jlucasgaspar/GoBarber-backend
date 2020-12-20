import { getRepository, Repository } from 'typeorm'

import User from '../entities/User'
import IUsersRepository from "@modules/users/irepositories/IUsersRepository"
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

export default class UsersRepository implements IUsersRepository {
   private ormRepository: Repository<User>
   
   constructor() {
      this.ormRepository = getRepository(User)
   }

   public async findById(id: string): Promise<User | undefined> {
      const user = await this.ormRepository.findOne(id)

      return user
   }

   public async findByEmail(email: string): Promise<User | undefined> {
      const user = await this.ormRepository.findOne({
         where: { email: email }
      })

      return user
   }
   
   public async create({ email, password, name }: ICreateUserDTO): Promise<User> {
      const user = this.ormRepository.create({
         email: email,
         password: password,
         name: name
      })

      await this.ormRepository.save(user)

      return user
   }

   public async save(userData: User): Promise<User> {
      const user = await this.ormRepository.save(userData)

      return user
   }
}