import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.order.deleteMany()
  await prisma.item.deleteMany()

  await prisma.product.create({
    data: {
      id: 1,
      description: 'A',
      price: 100,
      height: 100,
      width: 30,
      length: 10,
      weight: 3,
      currency: 'BRL'
    }
  })

  await prisma.product.create({
    data: {
      id: 2,
      description: 'B',
      price: 200,
      height: 50,
      width: 50,
      length: 50,
      weight: 20,
      currency: 'BRL'
    }
  })

  await prisma.product.create({
    data: {
      id: 3,
      description: 'C',
      price: 200,
      height: 10,
      width: 10,
      length: 10,
      weight: 0.9,
      currency: 'BRL'
    }
  })

  await prisma.product.create({
    data: {
      id: 4,
      description: 'D',
      price: 100,
      height: 100,
      width: 30,
      length: 10,
      weight: 3,
      currency: 'USD'
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'VALE20',
      percentage: 20,
      expireDate: new Date('2024-12-31')
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'VALE20_EXPIRED',
      percentage: 20,
      expireDate: new Date('2023-10-31')
    }
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
