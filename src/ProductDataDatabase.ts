import { PrismaClient } from '@prisma/client'
import { ProductData } from './ProductData'

export class ProductDataDatabase implements ProductData {
  async getProduct(idProduct: number): Promise<any> {
    const prisma = new PrismaClient()
    const product = await prisma.product.findUnique({
      where: { id: idProduct }
    })

    return product
  }
}
