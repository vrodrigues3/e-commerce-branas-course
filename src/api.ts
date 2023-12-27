import express from 'express'
import { validate } from './cpfValidator'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.post('/checkout', async (req, res) => {
  const isValid = validate(req.body.cpf)
  if (!isValid) {
    return res.status(422).json({ message: 'Invalid cpf' })
  }

  let total = 0
  let freight = 0

  const products: number[] = []

  for (const item of req.body.items) {
    try {
      if (products.some((idProduct) => idProduct === item.idProduct)) {
        return res.status(422).json({ message: 'Duplicated product' })
      }
      products.push(item?.idProduct)
      const product = await prisma.product.findUnique({
        where: { id: item.idProduct }
      })

      if (product) {
        if (item.quantity <= 0) {
          return res.status(422).json({ message: 'Quantity must be positive' })
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
        return res.status(422).json({ message: 'Product not found' })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  if (req.body.coupon) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: req.body.coupon }
    })
    const today = new Date()
    if (coupon && coupon.expireDate.getTime() > today.getTime()) {
      total -= (total * coupon.percentage) / 100
    }
  }

  total += freight

  res.json({ total })
})

app.listen(3000, () => console.log('✅ Server connected'))
