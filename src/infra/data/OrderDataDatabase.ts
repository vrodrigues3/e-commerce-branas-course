import { PrismaClient } from '@prisma/client'
import { OrderData } from '../../domain/data/OrderData'
import { Order } from '../../domain/entities/Order'
import { Connection } from '../database/Connection'

export class OrderDataDatabase implements OrderData {
  constructor(readonly connection: Connection) {}
  async save(order: Order): Promise<void> {
    await this.connection.query().order.create({
      data: {
        cpf: order.cpf.getValue(),
        total: order.getTotal()
      }
    })

    await this.connection.close()
  }

  async getByCpf(cpf: string): Promise<any> {
    const [orderData] = await this.connection.query().order.findMany({
      where: {
        cpf
      }
    })
    await this.connection.close()
    return orderData
  }

  async count(): Promise<number> {
    const count = await this.connection.query().order.count()
    await this.connection.close()
    return count
  }
}
