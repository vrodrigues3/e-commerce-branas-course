import { Coupon } from './Coupon'
import { CouponData } from './CouponData'
import { CurrencyGateway } from './CurrencyGateway'
import { CurrencyGatewayRandom } from './CurrencyGatewayRandom'
import { FreightCalculator } from './FreightCalculator'
import { MailerConsole } from './MailerConsole'
import { OrderData } from './OrderData'
import { ProductData } from './ProductData'
import { validate } from './cpfValidator'

type Input = {
  cpf: string
  email?: string
  items: {
    idProduct: number
    quantity: number
  }[]
  coupon?: string
}

export class Checkout {
  constructor(
    readonly productData: ProductData,
    readonly couponData: CouponData,
    readonly orderData: OrderData,
    readonly currencyGateway: CurrencyGateway = new CurrencyGatewayRandom(),
    readonly mailer: MailerConsole = new MailerConsole()
  ) {}

  async execute(input: Input) {
    const isValid = validate(input.cpf)
    if (!isValid) {
      throw new Error('Invalid cpf')
    }
    let total = 0
    let freight = 0
    const currencies: any = await this.currencyGateway.getCurrencies()

    const productsIds: number[] = []

    for (const item of input.items) {
      if (productsIds.some((idProduct) => idProduct === item.idProduct)) {
        throw new Error('Duplicated product')
      }
      productsIds.push(item?.idProduct)
      const product = await this.productData.getProduct(item.idProduct)
      if (product) {
        if (item.quantity <= 0) {
          throw new Error('Quantity must be positive')
        }

        total +=
          product.price * (currencies[product.currency] || 1) * item.quantity
        freight += FreightCalculator.calculate(product)
      } else {
        throw new Error('Product not found')
      }
    }

    if (input.coupon) {
      const couponData = await this.couponData.getCoupon(input.coupon)
      const coupon = new Coupon(
        couponData.code,
        parseFloat(couponData.percentage),
        couponData.expireDate
      )
      if (coupon && !coupon.isExpired()) {
        total -= coupon.getDiscount(total)
      }
    }
    if (input.email) {
      this.mailer.send(
        input.email,
        'Checkout Success',
        'Your Purchase was successfully completed'
      )
    }
    total += freight
    const today = new Date()
    const year = today.getFullYear()
    const sequence = await this.orderData.count()
    const code = `${year}${new String(sequence + 1).padStart(8, '0')}`
    await this.orderData.save({ cpf: input.cpf, total })

    return { code, total }
  }
}
