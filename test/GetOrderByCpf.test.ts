import { Checkout } from '../src/application/Checkout'
import { CouponDataDatabase } from '../src/infra/data/CouponDataDatabase'
import { GetOrderByCpf } from '../src/application/GetOrderByCpf'
import { OrderDataDatabase } from '../src/infra/data/OrderDataDatabase'
import { ProductDataDatabase } from '../src/infra/data/ProductDataDatabase'
import { PrismaConnection } from '../src/infra/database/PrismaConnection'

test('should get an order', async () => {
  const connection = new PrismaConnection()
  const productData = new ProductDataDatabase(connection)
  const couponData = new CouponDataDatabase(connection)
  const orderData = new OrderDataDatabase(connection)
  const checkout = new Checkout(productData, couponData, orderData)
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ]
  }
  await checkout.execute(input)
  const getOrderByCpf = new GetOrderByCpf(orderData)
  const output = await getOrderByCpf.execute('168.995.350-09')
  expect(output.total).toBe(1240)
})
