import { Mailer } from './Mailer'

export class MailerConsole implements Mailer {
  async send(to: string, subject: string, message: string): Promise<void> {
    console.log(to, subject, message)
  }
}
