import express from 'express'
import { checkout } from './application'

const app = express()

app.use(express.json())

app.post('/checkout', async (req, res) => {
  const input = req.body
  try {
    const output = await checkout(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})

app.listen(3000, () => console.log('✅ Server connected'))
