import amqp from 'amqplib'
import { validate } from './cpfValidator'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function init() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('checkout', { durable: true })
  await channel.consume('checkout', async (message: any) => {
    const input = JSON.parse(message.content.toString())

    const isValid = validate(input.cpf)
    if (!isValid) {
      console.log('Invalid cpf')
      return
    }

    let total = 0
    let freight = 0

    const products: number[] = []

    for (const item of input.items) {
      if (products.some((idProduct) => idProduct === item.idProduct)) {
        console.log('Duplicated product')
        return
      }
      products.push(item?.idProduct)
      const product = await prisma.product.findFirst({
        where: { id: item.idProduct }
      })

      if (product) {
        if (item.quantity <= 0) {
          console.log('Quantity must be positive')
          return
        }

        total += product.price * item.quantity
        const volume =
          (product.width / 100) *
          (product.height / 100) *
          (product.length / 100)
        const density = product.weight / volume
        const itemFreight = 1000 * volume * (density / 100)
        freight += itemFreight >= 10 ? itemFreight : 10
      } else {
        console.log('Product not found')
        return
      }
    }

    if (input.coupon) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: input.coupon }
      })
      const today = new Date()
      if (coupon && coupon.expireDate.getTime() > today.getTime()) {
        total -= (total * coupon.percentage) / 100
      }
    }

    total += freight

    console.log({ total })
    // channel.ack(message)
  })
}

init()
