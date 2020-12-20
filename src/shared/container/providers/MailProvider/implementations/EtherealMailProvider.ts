import nodemailer, { Transporter } from 'nodemailer'
import { injectable, inject } from 'tsyringe'

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'
import IMailProvider from '../models/IMailProvider'

@injectable()
export default class EtherealMailProvider implements IMailProvider {
   private client: Transporter

   constructor(
      @inject('MailTemplateProvider')
      private mailTemplateProvider: IMailTemplateProvider
   ) {
      nodemailer.createTestAccount().then(account => {
         const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
               user: account.user,
               pass: account.pass
            },
            tls: {
               rejectUnauthorized: false
            }
         })
   
         this.client = transporter
      })
   }

   public async sendMail({ to, subject, templateData, from }: ISendMailDTO): Promise<void> {
      const message = await this.client.sendMail({
         from: {
            name: from?.name || 'Equipe GoBarber',
            address: from?.email || 'equipe@gobarber.com.br',
         },
         to: {
            name: to.name,
            address: to.email
         },
         subject: subject,
         html: await this.mailTemplateProvider.parse(templateData)
      })

      //console.log(body)

      console.log('message sent: ', message.messageId)
      console.log('preview URL: ', nodemailer.getTestMessageUrl(message))
   }
}