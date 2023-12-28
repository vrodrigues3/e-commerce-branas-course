import { checkout } from '../src/application'

test('should make an order with 3 products', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ]
  }
  const output = await checkout(input)
  expect(output.total).toBe(1240)
})
