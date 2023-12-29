import { Coupon } from './Coupon'
import { CouponData } from './CouponData'

type Output = {
  isExpired: boolean
  discount: number
}

export class ValidateCoupon {
  constructor(readonly couponData: CouponData) {}

  async execute(code: string, total: number): Promise<Output> {
    const couponData = await this.couponData.getCoupon(code)
    const coupon = new Coupon(
      couponData.code,
      parseFloat(couponData.percentage),
      couponData.expireDate
    )

    return {
      isExpired: coupon.isExpired(),
      discount: coupon.getDiscount(total)
    }
  }
}
