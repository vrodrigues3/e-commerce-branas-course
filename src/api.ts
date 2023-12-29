import express from 'express'
import { Checkout } from './Checkout'
import { ProductDataDatabase } from './ProductDataDatabase'
import { CouponDataDatabase } from './CouponDataDatabase'
import { OrderDataDatabase } from './OrderDataDatabase'

const app = express()

app.use(express.json())

app.post('/checkout', async (req, res) => {
  const input = req.body
  try {
    const productData = new ProductDataDatabase()
    const couponData = new CouponDataDatabase()
    const orderData = new OrderDataDatabase()
    const checkout = new Checkout(productData, couponData, orderData)
    const output = await checkout.execute(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})

app.listen(3000, () => console.log('✅ Server connected'))
