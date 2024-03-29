import FakeUsersRepository from '../irepositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../irepositories/fakes/FakeUserTokensRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository()
      fakeUserTokensRepository = new FakeUserTokensRepository()
      fakeMailProvider = new FakeMailProvider()

      
      sendForgotPasswordEmail = new SendForgotPasswordEmailService(
         fakeUsersRepository,
         fakeMailProvider,
         fakeUserTokensRepository
      )
   })


   it('should be able to recover the password using the email', async () => {
      const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')
         
      await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      await sendForgotPasswordEmail.execute({
         email: 'jhondoe@example.com'
      })

      expect(sendMail).toBeCalled()
   })


   it('should not be able to recover a non existing user password', async () => {
      await expect(sendForgotPasswordEmail.execute({
         email: 'jhondoe@example.com'
      })).rejects.toBeInstanceOf(AppError)
   })


   it('should generate a forgot password token', async () => {
      const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhondoe@example.com',
         password: '123456'
      })

      await sendForgotPasswordEmail.execute({
         email: 'jhondoe@example.com'
      })

      expect(generateToken).toHaveBeenCalledWith(user.id)
   })
})