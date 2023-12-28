import { PrismaClient } from '@prisma/client'
import { CouponData } from './CouponData'

export class CouponDataDatabase implements CouponData {
  async getCoupon(code: string): Promise<any> {
    const prisma = new PrismaClient()
    const coupon = await prisma.coupon.findFirst({
      where: { code }
    })

    return coupon
  }
}
