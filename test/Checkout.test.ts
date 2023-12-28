import { Checkout } from '../src/Checkout'
import { CouponData } from '../src/CouponData'
import { ProductData } from '../src/ProductData'
test('should make an order with 3 products', async () => {
  const input = {
    cpf: '168.995.350-09',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ]
  }
  const productData: ProductData = {
    async getProduct(idProduct: number): Promise<any> {
      const products: { [idProduct: number]: any } = {
        1: {
          id: 1,
          description: 'A',
          price: 100,
          height: 100,
          width: 30,
          length: 10,
          weight: 3
        },
        2: {
          id: 2,
          description: 'B',
          price: 200,
          height: 50,
          width: 50,
          length: 50,
          weight: 20
        },
        3: {
          id: 3,
          description: 'C',
          price: 200,
          height: 10,
          width: 10,
          length: 10,
          weight: 0.9
        }
      }

      return products[idProduct]
    }
  }
  const couponData: CouponData = {
    async getCoupon(code): Promise<any> {
      const coupons: { [code: string]: any } = {
        VALE20: {
          code: 'VALE20',
          percentage: 20,
          expireDate: new Date('2023-12-31')
        },
        VALE20_EXPIRED: {
          code: 'VALE20_EXPIRED',
          percentage: 20,
          expireDate: new Date('2023-10-31')
        }
      }
      return coupons[code]
    }
  }
  const checkout = new Checkout(productData, couponData)
  const output = await checkout.execute(input)
  expect(output.total).toBe(1240)
})
