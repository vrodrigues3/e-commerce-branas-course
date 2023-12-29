import { PrismaClient } from '@prisma/client'
import { OrderData } from './OrderData'

export class OrderDataDatabase implements OrderData {
  async save(order: any): Promise<void> {
    const prisma = new PrismaClient()
    await prisma.order.create({
      data: {
        cpf: order.cpf,
        total: order.total
      }
    })
  }

  async getByCpf(cpf: string): Promise<any> {
    const prisma = new PrismaClient()
    const [orderData] = await prisma.order.findMany({
      where: {
        cpf
      }
    })
    return orderData
  }

  async count(): Promise<number> {
    const prisma = new PrismaClient()
    const count = await prisma.order.count()
    return count
  }
}
