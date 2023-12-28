import { PrismaClient } from '@prisma/client'
import { validate } from './cpfValidator'

type Input = {
  cpf: string
  items: {
    idProduct: number
    quantity: number
  }[]
  coupon?: string
}

export const checkout = async (input: Input) => {
  const prisma = new PrismaClient()
  const isValid = validate(input.cpf)
  if (!isValid) {
    throw new Error('Invalid cpf')
  }

  let total = 0
  let freight = 0

  const products: number[] = []

  for (const item of input.items) {
    if (products.some((idProduct) => idProduct === item.idProduct)) {
      throw new Error('Duplicated product')
    }
    products.push(item?.idProduct)
    const product = await prisma.product.findUnique({
      where: { id: item.idProduct }
    })

    if (product) {
      if (item.quantity <= 0) {
        throw new Error('Quantity must be positive')
      }

      total += product.price * item.quantity
      const volume =
        (product.width / 100) * (product.height / 100) * (product.length / 100)
      const density = product.weight / volume
      const itemFreight = 1000 * volume * (density / 100)
      freight += itemFreight >= 10 ? itemFreight : 10
    } else {
      throw new Error('Product not found')
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

  return { total }
}
