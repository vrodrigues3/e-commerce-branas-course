import { Checkout } from '../src/Checkout'
import { CouponDataDatabase } from '../src/CouponDataDatabase'
import { GetOrderByCpf } from '../src/GetOrderByCpf'
import { OrderDataDatabase } from '../src/OrderDataDatabase'
import { ProductDataDatabase } from '../src/ProductDataDatabase'

test('should get an order', async () => {
  const productData = new ProductDataDatabase()
  const couponData = new CouponDataDatabase()
  const orderData = new OrderDataDatabase()
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
