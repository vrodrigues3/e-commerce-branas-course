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
  expect(output.total).toBe(1240)
})

test('should not make an order with non existent product', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [{ idProduct: 5, quantity: 3 }]
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
  expect(output.total).toBe(1040)
})

test('should make an order with 3 products and with an expired coupon discount', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    coupon: 'VALE20_EXPIRED'
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  const output = response.data
  expect(output.total).toBe(1240)
})

test('should make an order with negative quantity', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [{ idProduct: 1, quantity: -1 }]
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  expect(response.status).toBe(422)
  const output = response.data
  expect(output.message).toBe('Quantity must be positive')
})

test('should make an order with duplicate product', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 }
    ]
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  expect(response.status).toBe(422)
  const output = response.data
  expect(output.message).toBe('Duplicated product')
})

test('should make an order calculating freight', async () => {
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
  expect(output.total).toBe(1240)
})

test('should make an order calculating freight', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [{ idProduct: 3, quantity: 3 }]
  }
  const response = await axios.post('http://localhost:3000/checkout', input)
  const output = response.data
  expect(output.total).toBe(610)
})
