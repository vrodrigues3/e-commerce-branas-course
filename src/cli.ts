import { Checkout } from './application/Checkout'
import { CouponDataDatabase } from './infra/data/CouponDataDatabase'
import { OrderDataDatabase } from './infra/data/OrderDataDatabase'
import { ProductDataDatabase } from './infra/data/ProductDataDatabase'
import { PrismaConnection } from './infra/database/PrismaConnection'

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
  }

  if (command.startsWith('checkout')) {
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
  }
})
