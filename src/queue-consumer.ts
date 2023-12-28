import amqp from 'amqplib'
import { checkout } from './application'

async function init() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('checkout', { durable: true })
  await channel.consume('checkout', async (message: any) => {
    const input = JSON.parse(message.content.toString())

    try {
      const output = await checkout(input)
      console.log(output)
    } catch (error: any) {
      console.log(error.message)
    }
    channel.ack(message)
  })
}

init()
