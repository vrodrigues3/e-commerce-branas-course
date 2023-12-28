import amqp from 'amqplib'
import { Checkout } from './Checkout'
import { ProductDataDatabase } from './ProductDataDatabase'
import { CouponDataDatabase } from './CouponDataDatabase'

async function init() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('checkout', { durable: true })
  await channel.consume('checkout', async (message: any) => {
    const input = JSON.parse(message.content.toString())

    try {
      const productData = new ProductDataDatabase()
      const couponData = new CouponDataDatabase()
      const checkout = new Checkout(productData, couponData)
      const output = await checkout.execute(input)
      console.log(output)
    } catch (error: any) {
      console.log(error.message)
    }
    channel.ack(message)
  })
}

init()
