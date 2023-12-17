import axios from 'axios'

axios.defaults.validateStatus = () => true

test('should not make a checkout with invalid cpf', async () => {
  const input = {
    cpf: '168.995.350-10'
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  expect(response.status).toBe(422)
  const output = response.data
  expect(output.message).toBe('Invalid cpf')
})

test('should make an order with 3 products', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ]
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  const output = response.data
  expect(output.total).toBe(1000)
})

test('should not make an order with non existent product', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [{ idProduct: 4, quantity: 3 }]
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  expect(response.status).toBe(422)
  const output = response.data
  expect(output.message).toBe('Product not found')
})

test('should make an order with 3 products and with coupon discount', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    coupon: 'VALE20'
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  const output = response.data
  expect(output.total).toBe(800)
})
