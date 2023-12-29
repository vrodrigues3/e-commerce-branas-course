import { FreightCalculator } from './FreightCalculator'
import { ProductData } from './ProductData'

type Input = {
  items: {
    idProduct: number
    quantity: number
  }[]
}

type Output = {
  total: number
}

export class SimulateFreight {
  constructor(readonly productData: ProductData) {}

  async execute(input: Input): Promise<Output> {
    let total = 0
    for (const item of input.items) {
      const product = await this.productData.getProduct(item.idProduct)
      if (product) {
        total += FreightCalculator.calculate(product)
      } else {
        throw new Error('Product not found')
      }
    }
    return { total }
  }
}
