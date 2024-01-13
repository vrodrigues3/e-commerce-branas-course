import { OrderCode } from '../src/domain/entities/OrderCode'

test('should create an code order', () => {
  const orderCode = new OrderCode(new Date('2024-10-10'), 1)
  expect(orderCode.getValue()).toBe('202400000001')
})

test('should note create an code order if sequence is negative', () => {
  expect(() => new OrderCode(new Date('2024-10-10'), -1)).toThrow(
    new Error('Invalid sequence')
  )
})
