import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import IAppointmentsRepository from '@modules/appointments/irepositories/IAppointmentsRepository'
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'

import IUserRepository from '@modules/users/irepositories/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

container.registerSingleton<IAppointmentsRepository>(
   'AppointmentsRepository',
   AppointmentsRepository
)

container.registerSingleton<IUserRepository>('UsersRepository', UsersRepository)