import { ProductDataDatabase } from '../src/infra/data/ProductDataDatabase'
import { SimulateFreight } from '../src/application/SimulateFreight'
import { PrismaConnection } from '../src/infra/database/PrismaConnection'

test('should simulate freight to make an order', async () => {
  const connection = new PrismaConnection()
  const productData = new ProductDataDatabase(connection)
  const simulateFreight = new SimulateFreight(productData)
  const input = {
    items: [{ idProduct: 1, quantity: 1 }]
  }
  const output = await simulateFreight.execute(input)
  expect(output.total).toBe(30)
})
