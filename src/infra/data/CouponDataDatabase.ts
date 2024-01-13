import { PrismaClient } from '@prisma/client'
import { CouponData } from '../../domain/data/CouponData'
import { Coupon } from '../../domain/entities/Coupon'
import { Connection } from '../database/Connection'

export class CouponDataDatabase implements CouponData {
  constructor(readonly connection: Connection) {}
  async getCoupon(code: string): Promise<Coupon> {
    const couponData = await this.connection.query().coupon.findFirst({
      where: { code }
    })

    await this.connection.close()
    if (!couponData) {
      throw new Error('Coupon not found')
    }

    return new Coupon(
      couponData.code,
      couponData.percentage,
      couponData.expireDate
    )
  }
}
