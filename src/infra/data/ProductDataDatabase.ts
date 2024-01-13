import { PrismaClient } from '@prisma/client'
import { ProductData } from '../../domain/data/ProductData'
import { Product } from '../../domain/entities/Product'
import { Connection } from '../database/Connection'

export class ProductDataDatabase implements ProductData {
  constructor(readonly connection: Connection) {}

  async getProduct(idProduct: number): Promise<Product> {
    const productData = await this.connection.query().product.findUnique({
      where: { id: idProduct }
    })

    await this.connection.close()

    if (!productData) {
      throw new Error('Product not found')
    }

    return new Product(
      productData.id,
      productData.description,
      productData.price,
      productData.width,
      productData.height,
      productData.length,
      productData.weight,
      productData.currency
    )
  }
}
