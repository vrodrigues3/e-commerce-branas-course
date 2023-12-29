import { Coupon } from '../src/Coupon'

test('should test a coupon', async () => {
  const coupon = new Coupon('VALE20', 20, new Date('2024-10-10'))
  expect(coupon.isExpired()).toBeFalsy()
  expect(coupon.getDiscount(1000)).toBe(200)
})
