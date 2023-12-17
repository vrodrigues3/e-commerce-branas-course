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

  for (const item of req.body.items) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: item.idProduct }
      })

      if (product) {
        total += product.price * item.quantity
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
    if (coupon) {
      total -= (total * coupon.percentage) / 100
    }
  }

  res.json({ total })
})

app.listen(3000, () => console.log('✅ Server connected'))
