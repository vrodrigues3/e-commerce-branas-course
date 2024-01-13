import amqp from 'amqplib'
import { Checkout } from './application/Checkout'
import { ProductDataDatabase } from './infra/data/ProductDataDatabase'
import { CouponDataDatabase } from './infra/data/CouponDataDatabase'
import { OrderDataDatabase } from './infra/data/OrderDataDatabase'
import { PrismaConnection } from './infra/database/PrismaConnection'

async function init() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('checkout', { durable: true })
  await channel.consume('checkout', async (message: any) => {
    const input = JSON.parse(message.content.toString())

    try {
      const connection = new PrismaConnection()
      const productData = new ProductDataDatabase(connection)
      const couponData = new CouponDataDatabase(connection)
      const orderData = new OrderDataDatabase(connection)
      const checkout = new Checkout(productData, couponData, orderData)
      const output = await checkout.execute(input)
      console.log(output)
    } catch (error: any) {
      console.log(error.message)
    }
    channel.ack(message)
  })
}

init()
