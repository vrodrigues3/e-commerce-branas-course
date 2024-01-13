import { Coupon } from '../domain/entities/Coupon'
import { CouponData } from '../domain/data/CouponData'
import { CurrencyGateway } from '../infra/gateway/CurrencyGateway'
import { CurrencyGatewayRandom } from '../infra/gateway/CurrencyGatewayRandom'
import { FreightCalculator } from '../domain/entities/FreightCalculator'
import { MailerConsole } from '../infra/mailer/MailerConsole'
import { Order } from '../domain/entities/Order'
import { OrderCode } from '../domain/entities/OrderCode'
import { OrderData } from '../domain/data/OrderData'
import { ProductData } from '../domain/data/ProductData'
import { validate } from '../domain/entities/cpfValidator'

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
    const currencies = await this.currencyGateway.getCurrencies()
    const order = new Order(input.cpf)
    for (const item of input.items) {
      const product = await this.productData.getProduct(item.idProduct)
      const currencyValue = currencies.getCurrency(product.currency)
      order.addItem(product, item.quantity, product.currency, currencyValue)
    }
    if (input.coupon) {
      const coupon = await this.couponData.getCoupon(input.coupon)
      order.addCoupon(coupon)
    }
    await this.orderData.save(order)

    return { code: order.getCode(), total: order.getTotal() }
  }
}
