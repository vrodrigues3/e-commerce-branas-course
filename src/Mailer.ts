export interface Mailer {
  send(to: string, subject: string, message: string): Promise<void>
}
