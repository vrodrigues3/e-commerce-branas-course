import { Coupon } from '../src/domain/entities/Coupon'
import { Order } from '../src/domain/entities/Order'
import { Product } from '../src/domain/entities/Product'

test('should create an empty order with a valid CPF', () => {
  const order = new Order('168.995.350-09')
  expect(order.getTotal()).toBe(0)
})

test('should not create an order with a invalid CPF', () => {
  expect(() => new Order('111.111.111-11')).toThrow('Invalid cpf')
})

test('should create an order with 3 items', () => {
  const order = new Order('168.995.350-09')
  order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1)
  order.addItem(new Product(3, 'C', 30, 10, 10, 10, 1), 3)

  expect(order.getTotal()).toBe(6350)
})

test('should create an order with 3 items and coupon discount', () => {
  const order = new Order('168.995.350-09')
  order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1)
  order.addItem(new Product(3, 'C', 30, 10, 10, 10, 1), 3)
  order.addCoupon(new Coupon('VALE20', 20, new Date('2024-10-10')))

  expect(order.getTotal()).toBe(5132)
})

test('should not create an order with item with negative quantity', () => {
  const order = new Order('168.995.350-09')
  expect(() =>
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), -1)
  ).toThrow(new Error('Quantity must be positive'))
})

test('should not create an order with duplicated item', () => {
  const order = new Order('168.995.350-09')
  order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  expect(() =>
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  ).toThrow(new Error('Duplicated product'))
})

test('should create an order with 3 items and freight', () => {
  const order = new Order('168.995.350-09')
  order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1)
  order.addItem(new Product(3, 'C', 30, 10, 10, 10, 1), 3)

  expect(order.getTotal()).toBe(6350)
})

test('should create an order with 3 items and code', () => {
  const order = new Order('168.995.350-09', new Date('2024-01-13'), 1)
  order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)
  order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1)
  order.addItem(new Product(3, 'C', 30, 10, 10, 10, 1), 3)

  expect(order.getCode()).toBe('202400000001')
})
