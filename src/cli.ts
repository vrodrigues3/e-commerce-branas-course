import { PrismaClient } from '@prisma/client'
import { validate } from './cpfValidator'

const prisma = new PrismaClient()

const input: any = {
  items: []
}

process.stdin.on('data', async (data) => {
  const command = data.toString().replace(/\n/g, '')
  if (command.startsWith('set-cpf')) {
    const params = command.replace('set-cpf ', '')
    input.cpf = params
  }

  if (command.startsWith('add-item')) {
    const params = command.replace('add-item ', '')
    const [idProduct, quantityStr] = params.split(' ')

    const id = parseInt(idProduct)
    const quantity = parseInt(quantityStr)

    input.items.push({ id, quantity })
    console.log(input)
  }

  if (command.startsWith('checkout')) {
    const isValid = validate(input.cpf)
    if (!isValid) {
      console.log('Invalid cpf')
      return
    }

    let total = 0
    let freight = 0

    const products: number[] = []

    for (const item of input.items) {
      //   if (products.some((idProduct) => idProduct === item.idProduct)) {
      //     console.log('Duplicated product')
      //     return
      //   }
      //   products.push(item?.idProduct)
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
  }
})
