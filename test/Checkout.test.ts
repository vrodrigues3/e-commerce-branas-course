import { Checkout } from '../src/application/Checkout'
import { CouponData } from '../src/domain/data/CouponData'
import { CurrencyGatewayRandom } from '../src/infra/gateway/CurrencyGatewayRandom'
import { ProductData } from '../src/domain/data/ProductData'
import sinon from 'sinon'
import { ProductDataDatabase } from '../src/infra/data/ProductDataDatabase'
import { CouponDataDatabase } from '../src/infra/data/CouponDataDatabase'
import { MailerConsole } from '../src/infra/mailer/MailerConsole'
import { CurrencyGateway } from '../src/infra/gateway/CurrencyGateway'
import { Mailer } from '../src/infra/mailer/Mailer'
import { OrderData } from '../src/domain/data/OrderData'
import { Currencies } from '../src/domain/entities/Currencies'

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
          expireDate: new Date('2024-12-31')
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
  const orderData: OrderData = {
    async save(order: any): Promise<void> {},
    async getByCpf(cpf: string): Promise<any> {},
    async count(): Promise<number> {
      return 1
    }
  }
  const checkout = new Checkout(productData, couponData, orderData)
  const output = await checkout.execute(input)
  expect(output.total).toBe(1240)
})

test('should make an order with 4 products and different currencies', async () => {
  const currencies = new Currencies()
  currencies.addCurrency('USD', 2)
  currencies.addCurrency('BRL', 1)
  const currencyGatewayStub = sinon
    .stub(CurrencyGatewayRandom.prototype, 'getCurrencies')
    .resolves(currencies)
  const mailerSpy = sinon.spy(MailerConsole.prototype, 'send')
  const input = {
    cpf: '168.995.350-09',
    email: 'vinicius@test.com',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
      { idProduct: 4, quantity: 1 }
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
          weight: 3,
          currency: 'BRL'
        },
        2: {
          id: 2,
          description: 'B',
          price: 200,
          height: 50,
          width: 50,
          length: 50,
          weight: 20,
          currency: 'BRL'
        },
        3: {
          id: 3,
          description: 'C',
          price: 200,
          height: 10,
          width: 10,
          length: 10,
          weight: 0.9,
          currency: 'BRL'
        },
        4: {
          id: 4,
          description: 'D',
          price: 100,
          height: 100,
          width: 30,
          length: 10,
          weight: 3,
          currency: 'USD'
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
  // const productData = new ProductDataDatabase()
  // const couponData = new CouponDataDatabase()
  const orderData: OrderData = {
    async save(order: any): Promise<void> {},
    async getByCpf(cpf: string): Promise<any> {},
    async count(): Promise<number> {
      return 1
    }
  }
  const checkout = new Checkout(productData, couponData, orderData)
  const output = await checkout.execute(input)
  expect(output.total).toBe(1470)
  // expect(mailerSpy.calledOnce).toBeTruthy()
  // expect(
  //   mailerSpy.calledWith(
  //     'vinicius@test.com',
  //     'Checkout Success',
  //     'Your Purchase was successfully completed'
  //   )
  // ).toBeTruthy()
  currencyGatewayStub.restore()
  mailerSpy.restore()
})

test('should make an order with 4 products and different currencies with mock', async () => {
  const currencies = new Currencies()
  currencies.addCurrency('USD', 2)
  currencies.addCurrency('BRL', 1)
  const currencyGatewayMock = sinon.mock(CurrencyGatewayRandom.prototype)
  currencyGatewayMock.expects('getCurrencies').once().resolves(currencies)
  // const mailerMock = sinon.mock(MailerConsole.prototype)
  // mailerMock
  //   .expects('send')
  //   .once()
  //   .withArgs(
  //     'vinicius@test.com',
  //     'Checkout Success',
  //     'Your Purchase was successfully completed'
  //   )
  const input = {
    cpf: '168.995.350-09',
    email: 'vinicius@test.com',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
      { idProduct: 4, quantity: 1 }
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
          weight: 3,
          currency: 'BRL'
        },
        2: {
          id: 2,
          description: 'B',
          price: 200,
          height: 50,
          width: 50,
          length: 50,
          weight: 20,
          currency: 'BRL'
        },
        3: {
          id: 3,
          description: 'C',
          price: 200,
          height: 10,
          width: 10,
          length: 10,
          weight: 0.9,
          currency: 'BRL'
        },
        4: {
          id: 4,
          description: 'D',
          price: 100,
          height: 100,
          width: 30,
          length: 10,
          weight: 3,
          currency: 'USD'
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
  // const productData = new ProductDataDatabase()
  // const couponData = new CouponDataDatabase()
  const orderData: OrderData = {
    async save(order: any): Promise<void> {},
    async getByCpf(cpf: string): Promise<any> {},
    async count(): Promise<number> {
      return 1
    }
  }
  const checkout = new Checkout(productData, couponData, orderData)
  const output = await checkout.execute(input)
  expect(output.total).toBe(1470)

  // mailerMock.verify()
  // mailerMock.restore()
  currencyGatewayMock.verify()
  currencyGatewayMock.restore()
})

test('should make an order with 4 products and different currencies with fake', async () => {
  const input = {
    cpf: '168.995.350-09',
    email: 'vinicius@test.com',
    items: [
      { idProduct: 1, quantity: 2 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
      { idProduct: 4, quantity: 1 }
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
          weight: 3,
          currency: 'BRL'
        },
        2: {
          id: 2,
          description: 'B',
          price: 200,
          height: 50,
          width: 50,
          length: 50,
          weight: 20,
          currency: 'BRL'
        },
        3: {
          id: 3,
          description: 'C',
          price: 200,
          height: 10,
          width: 10,
          length: 10,
          weight: 0.9,
          currency: 'BRL'
        },
        4: {
          id: 4,
          description: 'D',
          price: 100,
          height: 100,
          width: 30,
          length: 10,
          weight: 3,
          currency: 'USD'
        }
      }
      //
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
  const currencies = new Currencies()
  currencies.addCurrency('USD', 2)
  currencies.addCurrency('BRL', 1)
  const currencyGateway: CurrencyGateway = {
    async getCurrencies(): Promise<any> {
      return currencies
    }
  }
  const log: { to: string; subject: string; message: string }[] = []
  const mailer: Mailer = {
    async send(to: string, subject: string, message: string): Promise<void> {
      log.push({ to, subject, message })
    }
  }
  const orderData: OrderData = {
    async save(order: any): Promise<void> {},
    async getByCpf(cpf: string): Promise<any> {},
    async count(): Promise<number> {
      return 1
    }
  }
  const checkout = new Checkout(
    productData,
    couponData,
    orderData,
    currencyGateway,
    mailer
  )
  const output = await checkout.execute(input)
  expect(output.total).toBe(1470)
  // expect(log).toHaveLength(1)
  // expect(log[0].to).toBe('vinicius@test.com')
  // expect(log[0].subject).toBe('Checkout Success')
  // expect(log[0].message).toBe('Your Purchase was successfully completed')
})

test('should make an order with 3 products with order code', async () => {
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
  const orderData: OrderData = {
    async save(order: any): Promise<void> {},
    async getByCpf(cpf: string): Promise<any> {},
    async count(): Promise<number> {
      return 0
    }
  }
  const checkout = new Checkout(productData, couponData, orderData)
  const output = await checkout.execute(input)
  expect(output.code).toBe('202400000001')
})
