import User from '../infra/typeorm/entities/User'
import ICreateUserDTO from '../dtos/ICreateUserDTO'
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO'

export default interface IUserRepository {
   findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>
   findByEmail(email: string): Promise<User | undefined>
   findById(id: string): Promise<User | undefined>
   create(userData: ICreateUserDTO): Promise<User>
   save(userData: User): Promise<User>
}