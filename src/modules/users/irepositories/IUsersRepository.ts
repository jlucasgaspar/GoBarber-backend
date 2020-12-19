import User from '../infra/typeorm/entities/User'
import ICreateUserDTO from '../dtos/ICreateUserDTO'

export default interface IUserRepository {
   findByEmail(email: string): Promise<User | undefined>
   findById(id: string): Promise<User | undefined>
   create(userData: ICreateUserDTO): Promise<User>
   save(userData: User): Promise<User>
}